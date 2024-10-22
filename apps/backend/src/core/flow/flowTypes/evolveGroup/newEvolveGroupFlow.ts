import { FlowType, Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { createEvolveGroupFlowArgs } from "./createEvolveGroupFlowArgs";
import { newFlow } from "../../newFlow";

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
    args,
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
