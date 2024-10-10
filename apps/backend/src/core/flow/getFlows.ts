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
  createUserWatchedFlowFilter,
} from "./flowPrismaTypes";
import { flowSummaryResolver } from "./resolvers/flowSummaryResolver";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";

// Gets all flows that user has request permissions for on the first step of the flow, or that user created
// intentionally not pulling processes that have the "anyone" permission
// TODO: In the future, this query will only pull flows that user has interacted with or created
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

  const flows: FlowSummaryPrismaType[] = await prisma.flow.findMany({
    include: createFlowSummaryInclude(user),
    take: args.limit,
    skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
    cursor: args.cursor ? { id: args.cursor } : undefined,
    where: {
      reusable: true,
      AND: [
        args.watchFilter !== WatchFilter.All && user
          ? createUserWatchedFlowFilter({
              user,
              watched: args.watchFilter === WatchFilter.Watched,
            })
          : {},
        { type: { not: "Evolve" } },
        args.searchQuery !== ""
          ? {
              OR: [
                {
                  // OR/NOT logic is breaking the type checking
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
              OR: [
                { groupId: args.groupId },
                {
                  GroupsWatchedFlows: {
                    some: {
                      groupId: args.groupId,
                    },
                  },
                },
              ],
            }
          : { groupId: null },
        // TODO: reduce some non-DRY code with requestSteps permission logic

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

  return flows.map((flow) => flowSummaryResolver({ flow, groupIds, context }));
};

const createFlowPermissionFilter = (
  groupIds: string[],
  identityIds: string[],
  userId: string | undefined,
): Prisma.FlowVersionWhereInput => ({
  Steps: {
    some: {
      index: 0,
      OR: [
        {
          RequestPermissions: {
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
        },
      ],
    },
  },
});
