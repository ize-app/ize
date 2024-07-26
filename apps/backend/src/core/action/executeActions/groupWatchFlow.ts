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
}): Promise<boolean> => {
  try {
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
      return fieldAnswer.Field.name === GroupWatchFlowFields.WatchFlow;
    });
    const flowsToStopWatching = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
      return fieldAnswer.Field.name === GroupWatchFlowFields.UnwatchFlow;
    });

    const groupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.id;

    if (!groupId)
      throw new GraphQLError(`Cannot find owner group for request step ${requestStepId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    if (flowsToWatch && flowsToWatch.AnswerFreeInput[0].value) {
      const flowIds: string[] = JSON.parse(flowsToWatch?.AnswerFreeInput[0].value);
      await transaction.groupsWatchedFlows.createMany({
        data: flowIds.map((flowId) => ({
          groupId,
          flowId,
          watched: true,
        })),
      });
    }

    if (flowsToStopWatching && flowsToStopWatching.AnswerFreeInput[0].value) {
      const flowIds: string[] = JSON.parse(flowsToStopWatching?.AnswerFreeInput[0].value);
      await transaction.groupsWatchedFlows.deleteMany({
        where: {
          groupId,
          flowId: {
            in: flowIds,
          },
        },
      });
    }

    return true;
  } catch (e) {
    console.log("groupWatchFlow error", e);
    return false;
  }
};
