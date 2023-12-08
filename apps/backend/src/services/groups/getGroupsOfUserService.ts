import { prisma } from "../../prisma/client";

import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";

import { QueryGroupsForCurrentUserArgs } from "@graphql/generated/resolver-types";

export const getGroupsOfUserService = async (args: QueryGroupsForCurrentUserArgs) => {
  // Get groups that the user is in a server, role or has created.
  const groups = await prisma.group.findMany({
    where: {
      id: {
        in: args.groupIds,
      },
    },
    include: groupInclude,
  });

  const formattedGroups = groups.map((group) => formatGroup(group));
  return formattedGroups;
};
