import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import {
  QueryGroupsForCurrentUserArgs,
  WatchGroupFilter,
} from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { getGroupIdsOfUser } from "./getGroupIdsOfUser";
import { groupInclude } from "./groupPrismaTypes";
import { groupResolver } from "./groupResolver";

export const getGroupsOfUser = async ({
  context,
  args,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  args: QueryGroupsForCurrentUserArgs;
  transaction?: Prisma.TransactionClient;
}) => {
  if (!context.currentUser) throw Error("ERROR: Unauthenticated user");
  // Get groups that the user is in a server, role or has created.
  const groupIds = await getGroupIdsOfUser({ user: context.currentUser, transaction });

  const groupsCustom = await transaction.groupCustom.findMany({
    take: args.limit,
    skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
    cursor: args.cursor ? { id: args.cursor } : undefined,
    where: {
      AND: [
        args.searchQuery !== ""
          ? {
              name: {
                contains: args.searchQuery,
                mode: "insensitive",
              },
            }
          : {},
        args.watchFilter !== WatchGroupFilter.All
          ? {
              group: {
                UsersWatchedGroups: {
                  some: {
                    userId: context.currentUser.id,
                    watched: args.watchFilter === WatchGroupFilter.Watched,
                  },
                },
              },
            }
          : {
              groupId: {
                in: groupIds,
              },
            },
      ],
    },

    include: {
      group: {
        include: groupInclude,
      },
    },
    orderBy: { group: { createdAt: "desc" } },
  });

  const watchRecords = await transaction.usersWatchedGroups.findMany({
    where: {
      userId: context.currentUser.id,
    },
  });

  const formattedGroups = groupsCustom.map((group) => {
    const watchRecord = watchRecords.find((record) => record.groupId === group.groupId);
    const isMember = groupIds.includes(group.groupId);
    return groupResolver(group.group, watchRecord?.watched ?? false, isMember);
  });
  return formattedGroups;
};
