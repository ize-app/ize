import { RequestStepSummary } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { requestStepSummaryInclude } from "./requestPrismaTypes";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { requestStepSummaryResolver } from "./resolvers/requestStepSummaryResolver";
import { MePrismaType } from "../user/userPrismaTypes";

export const getRequestSteps = async ({
  args,
  user,
}: {
  args: {};
  user: MePrismaType;
}): Promise<RequestStepSummary[]> => {
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user.Identities.map((id) => id.id);
  return await prisma.$transaction(async (transaction) => {
    const requestSteps = await transaction.requestStep.findMany({
      where: {
        Request: {
          OR: [
            {
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
      },
      include: requestStepSummaryInclude,
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
