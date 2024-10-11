import { FieldDataType, Prisma } from "@prisma/client";

import { EvolveFlowFields } from "@/core/flow/flowTypes/evolveFlow/EvolveFlowFields";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const evolveFlow = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  // find the current / proposed fields in the request
  const requestStep = await transaction.requestStep.findFirstOrThrow({
    include: {
      RequestFieldAnswers: { include: { Field: true, AnswerFreeInput: true } },
    },
    where: {
      id: requestStepId,
    },
  });

  const proposedFlowField = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.name === (EvolveFlowFields.ProposedFlow as string);
  });

  if (!proposedFlowField)
    throw new GraphQLError(`Cannot find proposed flow version for request step ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (
    proposedFlowField.type !== "FreeInput" ||
    proposedFlowField.Field.freeInputDataType !== FieldDataType.FlowVersionId
  )
    throw new GraphQLError(
      `Field id ${proposedFlowField.Field.id} is the incorrect type for an evolve request`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  // make proposed the current_flow_version_id and switch it's status to draft = false

  const proposedFlowVersion = await transaction.flowVersion.findFirstOrThrow({
    where: { id: proposedFlowField.AnswerFreeInput[0].value },
    include: {
      Flow: {
        include: {
          CurrentFlowVersion: true,
        },
      },
    },
  });

  const currentFlowVersionId = proposedFlowVersion.Flow.CurrentFlowVersion?.id;
  if (!currentFlowVersionId)
    throw new GraphQLError(
      `Cannot find current flow version for proposed flow version ${proposedFlowVersion.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  await transaction.flowVersion.update({
    where: { id: proposedFlowField.AnswerFreeInput[0].value },
    data: {
      active: true,
      publishedAt: new Date(),
      // change current flow version to inactive
      Flow: {
        update: {
          CurrentFlowVersion: {
            update: {
              active: false,
            },
          },
        },
      },
      FlowForCurrentVersion: { connect: { id: proposedFlowVersion.flowId } },
    },
  });

  // do the same thing for the evolve_draft_flow_version_id if it exists
  if (proposedFlowVersion.draftEvolveFlowVersionId && proposedFlowVersion.evolveFlowId) {
    await transaction.flowVersion.update({
      where: { id: proposedFlowVersion.draftEvolveFlowVersionId },
      data: {
        active: true,
        publishedAt: new Date(),
        Flow: {
          update: {
            CurrentFlowVersion: {
              update: {
                active: false,
              },
            },
          },
        },
        FlowForCurrentVersion: { connect: { id: proposedFlowVersion.evolveFlowId } },
      },
    });
  }
};
