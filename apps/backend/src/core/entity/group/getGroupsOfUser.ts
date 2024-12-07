import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import {
  IzeGroup,
  QueryGroupsForCurrentUserArgs,
  WatchFilter,
} from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { getGroupIdsOfUser } from "./getGroupIdsOfUser";
import { IzeGroupPrismaType, createIzeGroupInclude } from "./groupPrismaTypes";
import { izeGroupResolver } from "./izeGroupResolver";

export const getGroupsOfUser = async ({
  context,
  args,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  args: QueryGroupsForCurrentUserArgs;
  transaction?: Prisma.TransactionClient;
}): Promise<IzeGroup[]> => {
  if (!context.currentUser) throw Error("ERROR: Unauthenticated user");

  // Get groups that the user is in a server, role or has created.
  const groupIds = await getGroupIdsOfUser({ context, transaction });
  const entityIds = context.userEntityIds;

  let groupsIze: IzeGroupPrismaType[] = [];

  if (!args.acknowledged) {
    groupsIze = await transaction.groupIze.findMany({
      include: createIzeGroupInclude(entityIds),
      take: args.limit,
      skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
      cursor: args.cursor ? { groupId: args.cursor } : undefined,
      where: {
        group: {
          EntityWatchedGroups: {
            none: {
              entityId: { in: entityIds },
            },
          },
          id: { in: groupIds },
        },
      },
    });
  } else {
    groupsIze = await transaction.groupIze.findMany({
      include: createIzeGroupInclude(entityIds),
      take: args.limit,
      skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
      cursor: args.cursor ? { groupId: args.cursor } : undefined,
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
          {
            group: {
              EntityWatchedGroups: {
                some: {
                  entityId: { in: entityIds },
                  watched:
                    args.watchFilter !== WatchFilter.All
                      ? args.watchFilter === WatchFilter.Watched
                      : undefined,
                },
              },
            },
          },
        ],
      },
      orderBy: { group: { createdAt: "desc" } },
    });
  }

  return groupsIze.map((izeGroup) => izeGroupResolver({ izeGroup, context }));
};
