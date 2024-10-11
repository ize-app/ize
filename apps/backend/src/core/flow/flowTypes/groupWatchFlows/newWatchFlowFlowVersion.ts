import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { createGroupWatchFlowArgs } from "./createGroupWatchFlowArgs";
import { newStep } from "../../helpers/newStep";

export const newGroupWatchFlowFlowVersion = async ({
  transaction,
  flowId,
  evolveFlowId,
  active,
  context,
  policy,
  groupEntityId,
}: {
  transaction: Prisma.TransactionClient;
  flowId: string;
  evolveFlowId: string;
  active: boolean;
  context: GraphqlRequestContext;
  policy: GroupFlowPolicyArgs;
  groupEntityId: string;
}): Promise<string> => {
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: "Watch/unwatch flow",
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
    args: createGroupWatchFlowArgs({ groupEntityId, context, policy }),
    transaction,
    flowVersionId: flowVersion.id,
    index: 0,
    createdSteps: [],
    reusable: true,
  });

  return flowVersion.id;
};
