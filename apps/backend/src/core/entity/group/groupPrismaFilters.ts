import { Prisma } from "@prisma/client";

import { GroupWatchFilter } from "@/graphql/generated/resolver-types";

export const createIzeGroupWatchFilter = ({
  groupWatchFilter,
  userEntityIds,
}: {
  groupWatchFilter: GroupWatchFilter;
  userEntityIds: string[];
}): Prisma.GroupWhereInput => {
  switch (groupWatchFilter) {
    case GroupWatchFilter.All:
      return {};
    case GroupWatchFilter.Watched:
      return {
        EntityWatchedGroups: {
          some: {
            entityId: { in: userEntityIds },
            watched: true,
          },
        },
      };
    case GroupWatchFilter.NotWatched:
      return {
        OR: [
          {
            EntityWatchedGroups: {
              some: {
                entityId: { in: userEntityIds },
                watched: false,
              },
            },
          },
          {
            EntityWatchedGroups: {
              none: {
                entityId: { in: userEntityIds },
              },
            },
          },
        ], 
      };
    case GroupWatchFilter.NotAcknowledged:
      return {
        EntityWatchedGroups: {
          none: {
            entityId: { in: userEntityIds },
          },
        },
      };
    default:
      return {};
  }
};
