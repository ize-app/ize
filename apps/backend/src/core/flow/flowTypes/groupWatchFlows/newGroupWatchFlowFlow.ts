import { FlowType, Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { createGroupWatchFlowFlowArgs } from "./createGroupWatchFlowFlowArgs";
import { newFlow } from "../../newFlow";

export const newGroupWatchFlowFlow = async ({
  groupEntityId,
  groupId,
  policy,
  context,
}: {
  context: GraphqlRequestContext;
  groupId: string;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const args = createGroupWatchFlowFlowArgs({ groupEntityId, context, policy });

  const flowId = await newFlow({
    args,
    entityContext: {
      type: "user",
      context,
    },
    type: FlowType.GroupWatchFlow,
    groupId,
  });

  return flowId;
};
