import { Prisma } from "@prisma/client";

import { FlowWatchFilter } from "@/graphql/generated/resolver-types";

import { createPermissionFilter } from "../permission/permissionPrismaTypes";

export const createFlowWatchFilter = ({
  flowWatchFilter,
  userEntityIds,
}: {
  flowWatchFilter: FlowWatchFilter;
  userEntityIds: string[];
}): Prisma.FlowWhereInput => {
  const watchedByMe = createUserWatchedFlowFilter({ userEntityIds });
  const watchedByMyGroups = createUserGroupsWatchedFlowsFilter({ userEntityIds });

  switch (flowWatchFilter) {
    case FlowWatchFilter.WatchedByMeOrMyGroups:
      return { OR: [watchedByMe, watchedByMyGroups] };
    case FlowWatchFilter.WatchedByMe:
      return watchedByMe;
    case FlowWatchFilter.NotWatching:
      return { NOT: [watchedByMe, watchedByMyGroups] };
    default:
      return {};
  }
};

// used for getting flows that a user is watching as well as request steps from flows they are watching
export const createUserWatchedFlowFilter = ({ userEntityIds }: { userEntityIds: string[] }) => {
  // flows watched directly by user OR
  const userWatchedQuery: Prisma.FlowWhereInput = {
    EntityWatchedFlows: {
      some: {
        entityId: { in: userEntityIds },
        watched: true,
      },
    },
  };

  return userWatchedQuery;
};

export const createFlowPermissionFilter = (
  groupIds: string[],
  identityIds: string[],
  userId: string | undefined,
): Prisma.FlowVersionWhereInput => ({
  TriggerPermissions: createPermissionFilter({ groupIds, identityIds, userId }),
});

export const createUserGroupsWatchedFlowsFilter = ({
  userEntityIds,
}: {
  userEntityIds: string[];
}) => {
  const userGroupsWatchedQuery: Prisma.FlowWhereInput = {
    EntityWatchedFlows: {
      some: {
        Entity: {
          Group: {
            EntityWatchedGroups: {
              some: { entityId: { in: userEntityIds }, watched: true },
            },
          },
        },
      },
    },
  };
  return userGroupsWatchedQuery;
};

export const createGroupWatchedFlowFilter = ({
  groupId,
  watched,
  excudeOwnedFlows = false,
}: {
  groupId: string;
  watched: boolean;
  excudeOwnedFlows?: boolean;
}) => {
  if (watched)
    return Prisma.validator<Prisma.FlowWhereInput>()({
      OR: [
        !excudeOwnedFlows ? { OwnerGroup: { id: groupId } } : {},
        {
          EntityWatchedFlows: {
            some: {
              Entity: {
                Group: {
                  id: groupId,
                },
              },
            },
          },
        },
      ],
    });
  else
    return Prisma.validator<Prisma.FlowWhereInput>()({
      NOT: {
        EntityWatchedFlows: {
          some: {
            Entity: {
              Group: {
                id: groupId,
              },
            },
          },
        },
      },
    });
};
