import { FlowSummary } from "@/graphql/generated/resolver-types";

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
  args: {};
  user: MePrismaType;
}): Promise<FlowSummary[]> => {
  const groupIds: string[] = await getGroupIdsOfUser({ user });
  const identityIds: string[] = user.Identities.map((id) => id.id);

  const flows: FlowSummaryPrismaType[] = await prisma.flow.findMany({
    include: flowSummaryInclude,
    where: {
      // id: args.flowId,
      AND: [
        { type: "Custom" },
        {
          OR: [
            {
              CurrentFlowVersion: {
                Steps: {
                  some: {
                    index: 0,
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
      ],
    },
  });

  return flows.map((flow) => flowSummaryResolver({ flow, identityIds, groupIds, userId: user.id }));
};
