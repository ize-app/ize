import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";
import {
  FieldAnswerArgs,
  FlowType,
  MutationNewEvolveRequestArgs,
  NewRequestArgs,
} from "@graphql/generated/resolver-types";

import { newRequest } from "./newRequest";
import { prisma } from "../../prisma/client";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { EvolveFlowFields } from "../flow/flowTypes/evolveFlow/EvolveFlowFields";
import { newFlowVersion } from "../flow/newFlowVersion";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newEvolveRequest = async ({
  args,
  entityContext,
}: {
  args: MutationNewEvolveRequestArgs;
  entityContext: UserOrIdentityContextInterface;
}): Promise<string> => {
  const [requestArgs, proposedFlowVersionId] = await prisma.$transaction(async (transaction) => {
    let draftEvolveFlowVersionId: string | null = null;

    const {
      request: { new: proposedFlow, flowId },
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

    if (!proposedFlow.evolve)
      throw new GraphQLError("Missing proposed evolve flow", {
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

    if (!flow.reusable)
      throw new GraphQLError(
        `Cannot create evolve request for a non-reusable flow. FlowId ${flowId}`,
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    // find evolve flow and it's fields so they can be referenced in the evolve request
    const evolveFlow = await transaction.flow.findUniqueOrThrow({
      where: { id: flow.CurrentFlowVersion.evolveFlowId },
      include: {
        CurrentFlowVersion: {
          include: {
            TriggerFieldSet: {
              include: fieldSetInclude,
            },
          },
        },
      },
    });

    const evoleFlowFields = evolveFlow.CurrentFlowVersion?.TriggerFieldSet?.FieldSetFields ?? [];

    const proposedFlowField = evoleFlowFields.find((field) => {
      return (field.Field.name as EvolveFlowFields) === EvolveFlowFields.ProposedFlow;
    });

    const currentFlowField = evoleFlowFields.find(
      (field) => (field.Field.name as EvolveFlowFields) === EvolveFlowFields.CurrentFlow,
    );

    const descriptionField = evoleFlowFields.find(
      (field) => (field.Field.name as EvolveFlowFields) === EvolveFlowFields.Description,
    );

    if (!proposedFlowField || !currentFlowField)
      throw new GraphQLError("Cannot find proposed flow and current flow fields of evolve flow", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    // create new evolve flow version
    // TODO - don't create this if there are no changes
    if (flow.CurrentFlowVersion?.evolveFlowId) {
      draftEvolveFlowVersionId = await newFlowVersion({
        transaction,
        flowId: flow.CurrentFlowVersion.evolveFlowId,
        active: false,
        draftEvolveFlowVersionId: null,
        // evolve flow evolves itself
        evolveFlowId: flow.CurrentFlowVersion?.evolveFlowId,
        flowArgs: proposedFlow.evolve,
      });
    }
    // create new custom flow version
    const proposedFlowVersionId = await newFlowVersion({
      transaction,
      flowArgs: proposedFlow.flow,
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

    return [requestArgs, proposedFlowVersionId];
  });

  return await newRequest({
    args: { request: requestArgs },
    entityContext,
    proposedFlowVersionId,
  });
};
