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
import { MePrismaType } from "../user/userPrismaTypes";

// Gets all flows that user has request permissions for on the first step of the flow, or that user created
// intentionally not pulling processes that have the "anyone" permission
// TODO: In the future, this query will only pull flows that user has interacted with or created
export const getFlows = async ({
  args,
  user,
}: {
  args: QueryGetFlowsArgs;
  user: MePrismaType | undefined | null;
}): Promise<FlowSummary[]> => {
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user ? user.Identities.map((id) => id.id) : [];

  const flows: FlowSummaryPrismaType[] = await prisma.flow.findMany({
    include: createFlowSummaryInclude(user?.id),
    take: args.limit,
    skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
    cursor: args.cursor ? { id: args.cursor } : undefined,
    where: {
      reusable: true,
      AND: [
        args.watchFilter !== WatchFilter.All
          ? createUserWatchedFlowFilter({
              userId: user?.id ?? "",
              watched: args.watchFilter === WatchFilter.Watched,
            })
          : {},
        { type: { not: "Evolve" } },
        args.searchQuery !== ""
          ? {
              OR: [
                {
                  //@ts-expect-error - this is a valid query but I believe the createWatchedFlowFilter
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
                [args.triggerPermissionFilter === FlowTriggerPermissionFilter.TriggerPermission
                  ? "is"
                  : "NOT"]: {
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
                },
              },
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return flows.map((flow) =>
    flowSummaryResolver({ flow, identityIds, groupIds, userId: user?.id }),
  );
};
