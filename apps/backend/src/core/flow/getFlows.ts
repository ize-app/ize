import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import {
  FlowSummary,
  FlowTriggerPermissionFilter,
  QueryGetFlowsArgs,
  WatchFilter,
} from "@/graphql/generated/resolver-types";

import {
  FlowSummaryPrismaType,
  createFlowSummaryInclude,
  createGroupWatchedFlowFilter,
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
        // when query is for a user's watched flows
        args.watchFilter !== WatchFilter.All && user && !args.groupId
          ? createUserWatchedFlowFilter({
              entityIds: userEntityIds,
              watched: args.watchFilter === WatchFilter.Watched,
            })
          : {},
        { type: { not: "Evolve" } },
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
                    GroupCustom: {
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
                  excudeOwnedFlows: args.excludeOwnedFlows ?? false,
                  groupId: args.groupId,
                  watched: args.watchFilter !== WatchFilter.Unwatched,
                }),
                // when showing "unwatched flows" for a group,
                // show flows that are watched by the user (though excluding flows watched by groups)
                // this is useful for the flow "unwatch" field
                args.watchFilter === WatchFilter.Unwatched
                  ? createUserWatchedFlowFilter({
                      entityIds: userEntityIds,
                      watched: true,
                    })
                  : {},
              ],
            }
          : { groupId: null },

        args.triggerPermissionFilter !== FlowTriggerPermissionFilter.All
          ? {
              CurrentFlowVersion: {
                // the type checking breaks with this is/not logic, so I had to move createFlowPermissionFilter to its own function
                [args.triggerPermissionFilter === FlowTriggerPermissionFilter.TriggerPermission
                  ? "is"
                  : "NOT"]: createFlowPermissionFilter(groupIds, identityIds, user?.id),
              },
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

const createFlowPermissionFilter = (
  groupIds: string[],
  identityIds: string[],
  userId: string | undefined,
): Prisma.FlowVersionWhereInput => ({
  TriggerPermissions: {
    OR: [
      { anyone: true },
      {
        EntitySet: {
          EntitySetEntities: {
            some: {
              Entity: {
                OR: [
                  { Group: { id: { in: groupIds } } },
                  { Identity: { id: { in: identityIds } } },
                  { User: { id: userId } },
                ],
              },
            },
          },
        },
      },
    ],
  },
});
