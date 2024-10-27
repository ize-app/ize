import { Prisma } from "@prisma/client";

import {
  QueryGetRequestStepsArgs,
  RequestStepRespondPermissionFilter,
  RequestStepStatusFilter,
  RequestStepSummary,
} from "@/graphql/generated/resolver-types";

import { createRequestStepSummaryInclude } from "./requestPrismaTypes";
import { requestStepSummaryResolver } from "./resolvers/requestStepSummaryResolver";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { createGroupWatchedFlowFilter, createUserWatchedFlowFilter } from "../flow/flowPrismaTypes";
import { getUserEntityIds } from "../user/getUserEntityIds";
import { MePrismaType } from "../user/userPrismaTypes";

export const getRequestSteps = async ({
  args,
  user,
}: {
  args: QueryGetRequestStepsArgs;
  user: MePrismaType | undefined | null;
}): Promise<RequestStepSummary[]> => {
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user?.Identities.map((id) => id.id) ?? [];
  const entityIds = getUserEntityIds(user);
  return await prisma.$transaction(async (transaction) => {
    const requestSteps = await transaction.requestStep.findMany({
      take: args.limit,
      skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
      cursor: args.cursor ? { id: args.cursor } : undefined,
      where: {
        AND: [
          args.searchQuery !== ""
            ? {
                Request: {
                  OR: [
                    {
                      name: {
                        contains: args.searchQuery,
                        mode: "insensitive",
                      },
                    },
                    {
                      FlowVersion: {
                        name: {
                          contains: args.searchQuery,
                          mode: "insensitive",
                        },
                      },
                    },
                  ],
                },
              }
            : {},
          // if getting request steps for user, then get requests steps for flows (or corresponding evolve flows) they are watching
          // or that groups they are watching own/watch themselves
          args.userOnly && user?.id
            ? {
                OR: [
                  {
                    Request: {
                      FlowVersion: {
                        Flow: createUserWatchedFlowFilter({ entityIds, watched: true }),
                      },
                    },
                  },
                  {
                    Request: {
                      ProposedFlowVersionEvolution: {
                        Flow: createUserWatchedFlowFilter({ entityIds, watched: true }),
                      },
                    },
                  },
                ],
              }
            : {},
          // if getting requests for a specific flow, then get request steps for that flow or its corresponding evolve flow
          args.flowId
            ? {
                OR: [
                  {
                    Request: {
                      FlowVersion: {
                        flowId: args.flowId,
                      },
                    },
                  },
                  {
                    Request: {
                      ProposedFlowVersionEvolution: {
                        Flow: {
                          id: args.flowId,
                        },
                      },
                    },
                  },
                ],
              }
            : {},
          // if getting request steps for a specific group, then get request steps
          // for that the group watches or owns
          args.groupId
            ? {
                Request: {
                  OR: [
                    {
                      ProposedFlowVersionEvolution: {
                        Flow: createGroupWatchedFlowFilter({
                          groupId: args.groupId,
                          watched: true,
                        }),
                      },
                    },
                    {
                      FlowVersion: {
                        Flow: createGroupWatchedFlowFilter({
                          groupId: args.groupId,
                          watched: true,
                        }),
                      },
                    },
                  ],
                },
              }
            : {},
          args.statusFilter !== RequestStepStatusFilter.All
            ? { responseFinal: args.statusFilter === RequestStepStatusFilter.Closed }
            : {},
          args.respondPermissionFilter !== RequestStepRespondPermissionFilter.All && user
            ? {
                Request: {
                  [args.respondPermissionFilter ===
                  RequestStepRespondPermissionFilter.RespondPermission
                    ? "is"
                    : "NOT"]: createPermissionFilter(groupIds, identityIds, user.id), // moved where logic to its own function so typechecking would still work
                },
              }
            : {},
        ],
      },
      include: createRequestStepSummaryInclude(entityIds),
      // TODO revisit the ordering logic here
      orderBy: [
        {
          final: "asc",
        },
        {
          expirationDate: "asc",
        },
      ],
    });

    return requestSteps.map((requestStep) =>
      requestStepSummaryResolver({
        requestStepSummary: requestStep,
        identityIds,
        groupIds,
        userId: user?.id,
      }),
    );
  });
};

const createPermissionFilter = (
  groupIds: string[],
  identityIds: string[],
  userId: string,
): Prisma.RequestWhereInput => ({
  FlowVersion: {
    Steps: {
      some: {
        ResponseConfig: {
          ResponsePermissions: {
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
      },
    },
  },
});
