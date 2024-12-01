import { Prisma } from "@prisma/client";

import { GraphqlRequestContext, GraphqlRequestContextWithUser } from "@/graphql/context";
import {
  QueryGetRequestsArgs,
  RequestStepRespondPermissionFilter,
  RequestStepStatusFilter,
  RequestSummary,
} from "@/graphql/generated/resolver-types";

import { createRequestSummaryInclude } from "./requestPrismaTypes";
import { requestSummaryResolver } from "./resolvers/requestSummaryResolver";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { createGroupWatchedFlowFilter, createUserWatchedFlowFilter } from "../flow/flowPrismaTypes";
import { getUserEntityIds } from "../user/getUserEntityIds";

export const getRequestSummaries = async ({
  args,
  context,
}: {
  args: QueryGetRequestsArgs;
  context: GraphqlRequestContext;
}): Promise<RequestSummary[]> => {
  const user = (context as GraphqlRequestContextWithUser).currentUser;
  if (!user) return [];
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = (user.Identities ?? []).map((id) => id.id) ?? [];
  const entityIds = getUserEntityIds(user);

  return await prisma.$transaction(async (transaction) => {
    const requestSteps = await transaction.request.findMany({
      take: args.limit,
      skip: args.cursor ? 1 : 0, // Skip the cursor if it exists
      cursor: args.cursor ? { id: args.cursor } : undefined,
      where: {
        AND: [
          args.searchQuery !== ""
            ? {
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
              }
            : {},
          // if getting request steps for user, then get requests steps for flows (or corresponding evolve flows) they are watching
          // or that groups they are watching own/watch themselves
          args.userOnly && user?.id
            ? {
                OR: [
                  {
                    FlowVersion: {
                      Flow: createUserWatchedFlowFilter({ entityIds, watched: true }),
                    },
                  },
                  {
                    ProposedFlowVersionEvolution: {
                      Flow: createUserWatchedFlowFilter({ entityIds, watched: true }),
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
                    FlowVersion: {
                      flowId: args.flowId,
                    },
                  },
                  {
                    ProposedFlowVersionEvolution: {
                      Flow: {
                        id: args.flowId,
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
              }
            : {},
          args.statusFilter !== RequestStepStatusFilter.All
            ? { final: args.statusFilter === RequestStepStatusFilter.Closed }
            : {},
          args.respondPermissionFilter !== RequestStepRespondPermissionFilter.All && user
            ? {
                [args.respondPermissionFilter ===
                RequestStepRespondPermissionFilter.RespondPermission
                  ? "OR"
                  : "NOT"]: [createPermissionFilter(groupIds, identityIds, user.id)], // moved where logic to its own function so typechecking would still work
              }
            : {},
        ],
      },
      include: createRequestSummaryInclude(entityIds),
      // TODO revisit the ordering logic here
      orderBy: [
        {
          final: "asc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });

    return await Promise.all(
      requestSteps.map(
        async (requestStep) =>
          await requestSummaryResolver({
            requestSummary: requestStep,
            context,
            groupIds,
          }),
      ),
    );
  });
};

// filter condition is met if you have permissions on any of the
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
