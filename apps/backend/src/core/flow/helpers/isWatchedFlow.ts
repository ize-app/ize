import { Prisma } from "@prisma/client";

import { FlowVersionPrismaType } from "../flowPrismaTypes";

export const isWatchedFlow = async ({
  flowVersion,
  userId,
  transaction,
}: {
  flowVersion: FlowVersionPrismaType;
  userId: string | undefined;
  transaction: Prisma.TransactionClient;
}): Promise<boolean> => {
  if (!userId) return false;

  let hasWatchedGroupWatchingFlow = false;

  const watchedFlowRecord = await transaction.usersWatchedFlows.findFirst({
    where: {
      userId,
      flowId: flowVersion.Flow.id,
    },
  });

  // if flow is explicitly unwatched, return false, regardless of wheter group is watching
  if (watchedFlowRecord && !watchedFlowRecord.watched) {
    return false;
  }

  if (flowVersion.Flow.OwnerGroup) {
    // user is associated with at least 1 group
    // group is one that user is watching
    // AND group either
    //// 1) is the owner of the flow
    //// 2) is watching the flow

    const watchedGroupsWatchingFlows = await transaction.group.findFirst({
      where: {
        UsersWatchedGroups: {
          some: {
            // groupId: { in: [] }, // list of groups that user is watching
            OR: [
              {
                Group: {
                  GroupsWatchedFlows: {
                    some: {
                      flowId: flowVersion.Flow.id,
                      watched: true,
                    },
                  },
                },
              },
              {
                Group: {
                  OwnedFlows: {
                    some: { id: flowVersion.Flow.id },
                  },
                },
              },
            ],
          },
        },

        OR: [
          {
            OwnedFlows: {
              some: { id: flowVersion.Flow.id },
            },
          },
          {
            GroupsWatchedFlows: {
              some: { flowId: flowVersion.Flow.id },
            },
          },
        ],
      },
    });

    hasWatchedGroupWatchingFlow = !!watchedGroupsWatchingFlows;
  }

  if (hasWatchedGroupWatchingFlow || watchedFlowRecord?.watched) {
    return true;
  }

  return false;
};
