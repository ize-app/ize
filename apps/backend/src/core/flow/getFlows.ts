import { GraphqlRequestContext } from "@/graphql/context";
import { FlowSummary, QueryGetFlowsArgs } from "@/graphql/generated/resolver-types";

import {
  FlowSummaryPrismaType,
  createFlowPermissionFilter,
  createFlowSummaryInclude,
  createGroupWatchedFlowFilter,
  createUserGroupsWatchedFlowsFilter,
  createUserWatchedFlowFilter,
} from "./flowPrismaTypes";
import { flowSummaryResolver } from "./resolvers/flowSummaryResolver";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { getUserEntityIds } from "../user/getUserEntityIds";

// Gets all flows that user has request permissions for on the first step of the flow, or that user created
// intentionally not pulling processes that have the "anyone" permission
export const getFlows = async ({
  args,
  context,
}: {
  args: QueryGetFlowsArgs;
  context: GraphqlRequestContext;
}): Promise<FlowSummary[]> => {
  const user = context.currentUser;
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user ? user.Identities.map((id) => id.id) : [];

  const userEntityIds = getUserEntityIds(user);

  const flows: FlowSummaryPrismaType[] = await prisma.flow.findMany({
    include: createFlowSummaryInclude(userEntityIds),
    take: args.limit,
    skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
    cursor: args.cursor ? { id: args.cursor } : undefined,
    where: {
      reusable: true,
      AND: [
        { type: { not: "Evolve" } },
        {
          // we want results to be concatenation of user watched flows and grouped watched flows
          // not the intersection
          OR: [
            args.watchedByUser
              ? createUserWatchedFlowFilter({
                  userEntityIds: userEntityIds,
                })
              : {},
            args.watchedByUserGroups ? createUserGroupsWatchedFlowsFilter({ userEntityIds }) : {},
          ],
        },
        args.createdByUser ? { creatorEntityId: { in: userEntityIds } } : {},
        // filter by search query
        args.searchQuery !== ""
          ? {
              OR: [
                {
                  CurrentFlowVersion: {
                    name: {
                      contains: args.searchQuery,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  OwnerGroup: {
                    GroupIze: {
                      name: {
                        contains: args.searchQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            }
          : {},
        args.groupId
          ? {
              AND: [
                createGroupWatchedFlowFilter({
                  excudeOwnedFlows: false,
                  groupId: args.groupId,
                  watched: true,
                }),
              ],
            }
          : { groupId: null },
        args.excludeGroupId
          ? createGroupWatchedFlowFilter({
              excudeOwnedFlows: false,
              groupId: args.excludeGroupId,
              watched: false,
            })
          : {},

        args.hasTriggerPermissions
          ? {
              CurrentFlowVersion: createFlowPermissionFilter(groupIds, identityIds, user?.id),
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const res = flows.map((flow) => flowSummaryResolver({ flow, groupIds, context }));
  return res;
};
