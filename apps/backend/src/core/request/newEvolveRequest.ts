import { decrypt } from "@/prisma/encrypt";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";
import {
  FieldAnswerArgs,
  FlowType,
  MutationNewEvolveRequestArgs,
  NewRequestArgs,
} from "@graphql/generated/resolver-types";

import { newRequest } from "./newRequest";
import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { newCustomFlowVersion } from "../flow/customFlow/newCustomFlowVersion";
import { EvolveFlowFields } from "../flow/evolveFlow/EvolveFlowFields";
import { newEvolveFlowVersion } from "../flow/evolveFlow/newEvolveFlowVersion";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newEvolveRequest = async ({
  args,
  context,
}: {
  args: MutationNewEvolveRequestArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  return await prisma.$transaction(async (transaction) => {
    let draftEvolveFlowVersionId: string | null = null;

    const {
      request: { proposedFlow, flowId },
    } = args;

    const flow = await transaction.flow.findUniqueOrThrow({
      include: { CurrentFlowVersion: true },
      where: { id: flowId },
    });
    if (!flow.CurrentFlowVersion)
      throw new GraphQLError(`Missing current version of flow. FlowId ${flowId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
    if (!flow.CurrentFlowVersion.evolveFlowId)
      throw new GraphQLError(`Flow does not have an evolve flow. FlowId ${flowId}`, {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    // currently, we're only allowing evolve requests to be created for non-evolve flow
    // in the future, we'll allow evolve flows to evolve themselves independent of whatever flow it evolves
    // but this is a simplifying assumption for v1 because allowing this could result in invalid evolve flows
    if (flow.type === FlowType.Evolve)
      throw new GraphQLError(
        `Cannot create evolve request for an evolve flow directly. FlowId ${flowId}`,
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );
    // When elolve request is created on FE, the original webhook URI is not displayed for security reasons
    // instead, a truncated version is displayed.
    // if there is no change to the truncated version, then we need to hydrate the full URI into the request args
    const updatedProposedFlow = { ...proposedFlow };

    await Promise.all(
      proposedFlow.steps.map(async (step, index) => {
        const webhookArgs = step.action?.callWebhook;
        if (webhookArgs && webhookArgs.originalUri === webhookArgs.uri) {
          const newWebhook = updatedProposedFlow.steps[index].action?.callWebhook;
          if (!newWebhook)
            throw new GraphQLError(`Cannot find webhook for evolve request for flow ${flow.id}`, {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            });

          const currentWebhook = await transaction.webhook.findUniqueOrThrow({
            where: { id: newWebhook.webhookId },
          });
          const currentUriDecrypted = decrypt(currentWebhook.uri);
          newWebhook.uri = currentUriDecrypted;
        }
      }),
    );

    // find evolve flow and it's fields so they can be referenced in the evolve request
    const evolveFlow = await transaction.flow.findUniqueOrThrow({
      where: { id: flow.CurrentFlowVersion.evolveFlowId },
      include: {
        CurrentFlowVersion: {
          include: {
            Steps: {
              include: {
                RequestFieldSet: {
                  include: fieldSetInclude,
                },
              },
            },
          },
        },
      },
    });
    const evolveFlowStep =
      (evolveFlow.CurrentFlowVersion && evolveFlow.CurrentFlowVersion.Steps[0]) ?? null;
    if (!evolveFlowStep || !evolveFlowStep.RequestFieldSet)
      throw new GraphQLError(
        `Invalid evolve flow configuration. Cannot find first step of flow. flowVersionId: ${evolveFlow.currentFlowVersionId}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    const proposedFlowField = evolveFlowStep.RequestFieldSet.FieldSetFields.find((field) => {
      return field.Field.name === EvolveFlowFields.ProposedFlow;
    });

    const currentFlowField = evolveFlowStep.RequestFieldSet.FieldSetFields.find(
      (field) => field.Field.name === EvolveFlowFields.CurrentFlow,
    );

    const descriptionField = evolveFlowStep.RequestFieldSet.FieldSetFields.find(
      (field) => field.Field.name === EvolveFlowFields.Description,
    );

    if (!proposedFlowField || !currentFlowField)
      throw new GraphQLError("Cannot find proposed flow and current flow fields of evolve flow", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    // create new evolve flow version
    // TODO - don't create this if there are no changes
    if (flow.CurrentFlowVersion?.evolveFlowId) {
      draftEvolveFlowVersionId = await newEvolveFlowVersion({
        transaction,
        flowId: flow.CurrentFlowVersion?.evolveFlowId,
        evolveArgs: proposedFlow.evolve,
        active: false,
      });
    }
    // create new custom flow version
    const proposedFlowVersionId = await newCustomFlowVersion({
      transaction,
      flowArgs: proposedFlow,
      flowId: flow.id,
      evolveFlowId: flow.CurrentFlowVersion?.evolveFlowId ?? null,
      active: false,
      draftEvolveFlowVersionId,
    });

    const requestFields: FieldAnswerArgs[] = [
      {
        fieldId: currentFlowField.fieldId,
        value: flow.CurrentFlowVersion.id,
        optionSelections: [],
      },
      { fieldId: proposedFlowField.fieldId, value: proposedFlowVersionId, optionSelections: [] },
    ];

    if (descriptionField) {
      requestFields.push({
        fieldId: descriptionField.fieldId,
        value: args.request.description ?? null,
        optionSelections: [],
      });
    }

    const requestArgs: NewRequestArgs = {
      flowId: flow.CurrentFlowVersion.evolveFlowId,
      name: args.request.name,
      requestFields,
      requestDefinedOptions: [],
    };

    return await newRequest({
      args: { request: requestArgs },
      context,
      proposedFlowVersionId,
      transaction,
    });
  });
};
