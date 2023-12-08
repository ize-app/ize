import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";

import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";

import { getGroupIdsOfUserService } from "./getGroupIdsOfUserService";

export const getGroupsOfUserService = async (context: GraphqlRequestContext) => {
  const groupIds = await getGroupIdsOfUserService(context);

  // Get groups that the user is in a server, role or has created.
  const groups = await prisma.group.findMany({
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
