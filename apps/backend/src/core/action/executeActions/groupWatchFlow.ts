import { Prisma } from "@prisma/client";

import { SystemFieldType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const groupWatchFlow = async ({
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
          TriggerFieldAnswers: {
            include: {
              Field: true,
              Value: {
                include: { ValueFlows: true },
              },
            },
          },
        },
      },
      Step: {
        include: {
          FlowVersion: {
            include: {
              Flow: {
                include: {
                  OwnerGroup: {
                    include: {
                      GroupIze: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const requestFieldAnswers = requestStep.Request.TriggerFieldAnswers;

  const flowsToWatch = requestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.systemType === SystemFieldType.WatchFlow;
  });
  const flowsToStopWatching = requestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.systemType === SystemFieldType.UnwatchFlow;
  });

  const groupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.id;

  if (!groupId)
    throw new GraphQLError(`Cannot find owner group for request step ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (flowsToWatch && flowsToWatch.Value.ValueFlows) {
    const flows = flowsToWatch.Value.ValueFlows;
    await transaction.groupsWatchedFlows.createMany({
      data: flows.map((flow) => ({
        groupId,
        flowId: flow.flowId,
        watched: true,
      })),
    });
  }

  if (flowsToStopWatching && flowsToStopWatching.Value.ValueFlows) {
    const flowIds = flowsToStopWatching.Value.ValueFlows.map((flow) => flow.flowId);
    await transaction.groupsWatchedFlows.deleteMany({
      where: {
        groupId,
        flowId: {
          in: flowIds,
        },
      },
    });
  }
};
