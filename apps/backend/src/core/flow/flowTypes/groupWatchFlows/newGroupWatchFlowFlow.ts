import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { FlowType, GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { createGroupWatchFlowFlowArgs } from "./createGroupWatchFlowFlowArgs";
import { newFlow } from "../../newFlow";
import { createEvolveFlowFlowArgs } from "../evolveFlow/createEvolveFlowFlowArgs";

export const newGroupWatchFlowFlow = async ({
  groupEntityId,
  groupId,
  policy,
  context,
  transaction,
}: {
  context: GraphqlRequestContext;
  groupId: string;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const args = createGroupWatchFlowFlowArgs({ groupEntityId, context, policy });

  const flowId = await newFlow({
    args: {
      flow: args,
      evolve: createEvolveFlowFlowArgs({
        creatorEntityId: context.currentUser.entityId,
        groupEntityId,
      }),
      reusable: true,
    },
    entityContext: {
      type: "user",
      context,
    },
    type: FlowType.GroupWatchFlow,
    groupId,
    transaction,
  });

  return flowId;
};
