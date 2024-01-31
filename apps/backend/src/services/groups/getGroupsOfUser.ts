import { Prisma } from "@prisma/client";
import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";

import { groupInclude, formatGroup } from "@utils/formatGroup";
import { getGroupIdsOfUser } from "./getGroupIdsOfUser";

export const getGroupsOfUser = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  if (!context.currentUser) return [];
  // Get groups that the user is in a server, role or has created.
  const groupIds = await getGroupIdsOfUser({ user: context.currentUser, transaction });

  const groups = await transaction.group.findMany({
    where: {
      id: {
        in: groupIds,
      },
    },
    include: groupInclude,
  });

  const formattedGroups = groups.map((group) => formatGroup(group));
  return formattedGroups;
};
