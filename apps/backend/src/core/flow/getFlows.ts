import { FlowSummary, QueryGetFlowsArgs, WatchFilter } from "@/graphql/generated/resolver-types";

import { FlowSummaryPrismaType, flowSummaryInclude } from "./flowPrismaTypes";
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
  user: MePrismaType;
}): Promise<FlowSummary[]> => {
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user.Identities.map((id) => id.id);

  const flows: FlowSummaryPrismaType[] = await prisma.flow.findMany({
    include: flowSummaryInclude,
    take: args.limit,
    skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
    cursor: args.cursor ? { id: args.cursor } : undefined,
    where: {
      AND: [
        args.watchFilter !== WatchFilter.All
          ? {
              [args.watchFilter === WatchFilter.Watched ? "OR" : "NOT"]: [
                // flow is watched if either
                // 1) user is watching that flow
                // 2) The user did not unwatch that flow that they are watching
                //    a group that is watching that flow
                {
                  UsersWatchedFlows: {
                    some: {
                      userId: user.id,
                      watched: true,
                    },
                  },
                },
                {
                  UsersWatchedFlows: {
                    none: {
                      userId: user.id,
                      watched: false,
                    },
                  },
                  OR: [
                    {
                      OwnerGroup: {
                        UsersWatchedGroups: {
                          some: {
                            userId: user.id,
                            watched: true,
                          },
                        },
                      },
                    },
                    {
                      GroupsWatchedFlows: {
                        some: {
                          Group: {
                            UsersWatchedGroups: {
                              some: {
                                userId: user.id,
                                watched: true,
                              },
                            },
                            OR: [
                              {
                                GroupsWatchedFlows: {
                                  some: {
                                    watched: true,
                                  },
                                },
                              },
                            ],
                          },
                        }, // TODO switch out for watched groups
                      },
                    },
                  ],
                },
              ],
            }
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
          : // switch out to be flows user is watching or any of their groups are watching
            {},
        // {
        //     OR: [
        //       {
        //         CurrentFlowVersion: {
        //           Steps: {
        //             some: {
        //               index: 0,
        //               OR: [
        //                 {
        //                   RequestPermissions: {
        //                     EntitySet: {
        //                       EntitySetEntities: {
        //                         some: {
        //                           Entity: {
        //                             OR: [
        //                               { Group: { id: { in: groupIds } } },
        //                               { Identity: { id: { in: identityIds } } },
        //                             ],
        //                           },
        //                         },
        //                       },
        //                     },
        //                   },
        //                 },
        //                 {
        //                   ResponsePermissions: {
        //                     EntitySet: {
        //                       EntitySetEntities: {
        //                         some: {
        //                           Entity: {
        //                             OR: [
        //                               { Group: { id: { in: groupIds } } },
        //                               { Identity: { id: { in: identityIds } } },
        //                             ],
        //                           },
        //                         },
        //                       },
        //                     },
        //                   },
        //                 },
        //               ],
        //             },
        //           },
        //         },
        //       },
        //       {
        //         Creator: {
        //           id: user.id,
        //         },
        //       },
        //     ],
        //   },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return flows.map((flow) => flowSummaryResolver({ flow, identityIds, groupIds, userId: user.id }));
};
