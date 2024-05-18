import { prisma } from "../../prisma/client";
import {
  FieldAnswerArgs,
  MutationNewEvolveRequestArgs,
  NewRequestArgs,
} from "@graphql/generated/resolver-types";
import { GraphqlRequestContext } from "../../graphql/context";
import { newCustomFlowVersion } from "../flow/helpers/newCustomFlowVersion";
import { newEvolveFlowVersion } from "../flow/helpers/newEvolveFlowVersion";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { EvolveFlowFields } from "../flow/helpers/EvolveFlowFields";
import { newRequest } from "./newRequest";

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
      throw new GraphQLError("Missing current version of flow", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
    if (!flow.CurrentFlowVersion.evolveFlowId)
      throw new GraphQLError("Flow does not have an evolve flow ", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
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
      throw new GraphQLError("Invalid evolve flow configuration. Cannot find first step of flow", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

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
        draft: true,
      });
    }
    // create new custom flow version
    const proposedFlowVersionId = await newCustomFlowVersion({
      transaction,
      flowArgs: proposedFlow,
      flowId: flow.id,
      evolveFlowId: flow.CurrentFlowVersion?.evolveFlowId ?? null,
      draft: true,
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

    return await newRequest({ args: { request: requestArgs }, context, transaction });
  });
};
