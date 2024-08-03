import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";

import { createGroupUpdateMembershipFlowVersionArgs } from "./createGroupUpdateMembershipFlowVersionArgs";
import { newStep } from "../helpers/newStep";

export const newGroupUpdateMembershipFlowVersion = async ({
  transaction,
  flowId,
  evolveFlowId,
  active,
  context,
  groupEntityId,
}: {
  transaction: Prisma.TransactionClient;
  flowId: string;
  evolveFlowId: string;
  active: boolean;
  context: GraphqlRequestContext;
  groupEntityId: string;
}): Promise<string> => {
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: "Add/remove members",
      totalSteps: 1,
      reusable: true,
      active,
      publishedAt: !active ? null : new Date(),
      // evolve flow has evolve rights over itself.
      EvolveFlow: {
        connect: {
          id: evolveFlowId,
        },
      },
      FlowForCurrentVersion: !active
        ? undefined
        : {
            connect: {
              id: flowId,
            },
          },
      Flow: {
        connect: {
          id: flowId,
        },
      },
    },
  });

  await newStep({
    args: createGroupUpdateMembershipFlowVersionArgs({ groupEntityId, context }),
    transaction,
    flowVersionId: flowVersion.id,
    index: 0,
    createdSteps: [],
    reusable: true,
  });

  return flowVersion.id;
};
