import { QueryGetRequestStepsArgs, RequestStepSummary } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { requestStepSummaryInclude } from "./requestPrismaTypes";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { requestStepSummaryResolver } from "./resolvers/requestStepSummaryResolver";
import { MePrismaType } from "../user/userPrismaTypes";

export const getRequestSteps = async ({
  args,
  user,
}: {
  args: QueryGetRequestStepsArgs;
  user: MePrismaType;
}): Promise<RequestStepSummary[]> => {
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user.Identities.map((id) => id.id);
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
          args.userOnly
            ? {
                Request: {
                  OR: [
                    true && {
                      FlowVersion: {
                        Steps: {
                          some: {
                            RequestPermissions: {
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
                          },
                        },
                      },
                    },
                    {
                      Creator: {
                        id: user.id,
                      },
                    },
                  ],
                },
              }
            : {},
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
        ],
      },
      include: requestStepSummaryInclude,
      // TODO revisit the ordering logic here
      orderBy: {
        expirationDate: "asc",
      },
    });

    return requestSteps.map((requestStep) =>
      requestStepSummaryResolver({
        requestStepSummary: requestStep,
        identityIds,
        groupIds,
        userId: user.id,
      }),
    );
  });
};
