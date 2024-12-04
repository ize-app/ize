import { Prisma } from "@prisma/client";

import { SystemFieldType } from "@/graphql/generated/resolver-types";
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
      Request: {
        include: {
          TriggerFieldAnswers: { include: { Field: true, Value: true } },
        },
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const proposedFlowField = requestStep.Request.TriggerFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.systemType === SystemFieldType.EvolveFlowProposed;
  });

  if (!proposedFlowField || !proposedFlowField.Value.flowVersionId)
    throw new GraphQLError(`Cannot find proposed flow version for request step ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  // make proposed the current_flow_version_id and switch it's status to draft = false

  const proposedFlowVersion = await transaction.flowVersion.findFirstOrThrow({
    where: { id: proposedFlowField.Value.flowVersionId },
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
    where: { id: proposedFlowField.Value.flowVersionId },
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
