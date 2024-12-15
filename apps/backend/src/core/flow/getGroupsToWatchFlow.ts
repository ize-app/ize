import { GraphqlRequestContext } from "@/graphql/context";
import {
  Group,
  GroupsToWatch,
  QueryGetGroupsToWatchFlowArgs,
} from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { entitySetInclude } from "../entity/entityPrismaTypes";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import { groupResolver } from "../entity/group/groupResolver";
import { createPermissionFilter } from "../permission/permissionPrismaTypes";

export const getGroupsToWatchFlow = async ({
  args,
  context,
}: {
  args: QueryGetGroupsToWatchFlowArgs;
  context: GraphqlRequestContext;
}): Promise<GroupsToWatch> => {
  const user = context.currentUser;
  const groupIds: string[] = await getGroupIdsOfUser({ context });
  const identityIds: string[] = user ? user.Identities.map((id) => id.id) : [];

  // get groups that user is watching, can make watch requets for, and the group isn't already watching that flow
  const groups = await prisma.group.findMany({
    include: {
      ...groupInclude,
      GroupIze: {
        include: {
          MemberEntitySet: {
            include: entitySetInclude,
          },
        },
      },
    },
    where: {
      GroupIze: {
        NOT: undefined,
      },
      EntityWatchedGroups: {
        some: {
          entityId: { in: context.userEntityIds },
          watched: true,
        },
      },
      Entity: args.flowId ? { EntityWatchedFlows: { none: { flowId: args.flowId, watched: true } } } : {},
      OwnedFlows: {
        some: {
          type: "GroupWatchFlow",
          CurrentFlowVersion: {
            TriggerPermissions: createPermissionFilter({ groupIds, identityIds, userId: user?.id }),
          },
        },
      },
    },
  });

  const relevantGroups: Group[] = [];
  const otherGroups: Group[] = [];

  groups.forEach((group) => {
    let relevantGroup = false;
    if (args.entities.includes(group.entityId)) relevantGroup = true;
    group.GroupIze?.MemberEntitySet.EntitySetEntities.forEach((entity) => {
      if (args.entities.includes(entity.entityId)) relevantGroup = true;
    });
    if (relevantGroup) relevantGroups.push(groupResolver(group));
    else otherGroups.push(groupResolver(group));
  });

  return { relevantGroups, otherGroups };
};
