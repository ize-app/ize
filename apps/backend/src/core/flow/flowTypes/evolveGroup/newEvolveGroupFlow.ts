import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { FlowType, GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { createEvolveGroupFlowArgs } from "./createEvolveGroupFlowArgs";
import { newFlow } from "../../newFlow";
import { createEvolveFlowFlowArgs } from "../evolveFlow/createEvolveFlowFlowArgs";

export const newEvolveGroupFlow = async ({
  groupEntityId,
  groupId,
  context,
  transaction,
  policy,
}: {
  context: GraphqlRequestContext;
  groupId: string;
  groupEntityId: string;
  transaction: Prisma.TransactionClient;
  policy: GroupFlowPolicyArgs;
}): Promise<string | null> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const args = createEvolveGroupFlowArgs({ groupEntityId, context, policy });

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
    type: FlowType.EvolveGroup,
    groupId,
    transaction,
  });

  return flowId;
};
