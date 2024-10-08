import { Prisma } from "@prisma/client";

import { GroupWatchFlowFields } from "@/core/flow/groupWatchFlows/GroupWatchFlowFields";
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
      RequestFieldAnswers: { include: { Field: true, AnswerFreeInput: true } },
      Step: {
        include: {
          FlowVersion: {
            include: {
              Flow: {
                include: {
                  OwnerGroup: {
                    include: {
                      GroupCustom: true,
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

  const flowsToWatch = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.name === GroupWatchFlowFields.WatchFlow as string;
  });
  const flowsToStopWatching = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.name === GroupWatchFlowFields.UnwatchFlow as string;
  });

  const groupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.id;

  if (!groupId)
    throw new GraphQLError(`Cannot find owner group for request step ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (flowsToWatch && flowsToWatch.AnswerFreeInput[0].value) {
    const flowIds: string[] = JSON.parse(flowsToWatch?.AnswerFreeInput[0].value) as string[];
    await transaction.groupsWatchedFlows.createMany({
      data: flowIds.map((flowId) => ({
        groupId,
        flowId,
        watched: true,
      })),
    });
  }

  if (flowsToStopWatching && flowsToStopWatching.AnswerFreeInput[0].value) {
    const flowIds: string[] = JSON.parse(flowsToStopWatching?.AnswerFreeInput[0].value) as string[];
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
