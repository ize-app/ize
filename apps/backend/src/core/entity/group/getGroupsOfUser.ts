import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { IzeGroup, QueryGroupsForCurrentUserArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { getGroupIdsOfUser } from "./getGroupIdsOfUser";
import { createIzeGroupWatchFilter } from "./groupPrismaFilters";
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
  const groupsIze: IzeGroupPrismaType[] = await transaction.groupIze.findMany({
    include: createIzeGroupInclude(entityIds),
    take: args.limit,
    skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
    cursor: args.cursor ? { groupId: args.cursor } : undefined,
    orderBy: { group: { createdAt: "desc" } },
    where: {
      group: {
        AND: [
          { id: args.isMember ? { in: groupIds } : {} },
          createIzeGroupWatchFilter({
            groupWatchFilter: args.watchFilter,
            userEntityIds: entityIds,
          }),
        ],
      },
    },
  });

  return groupsIze.map((izeGroup) => izeGroupResolver({ izeGroup, context }));
};
