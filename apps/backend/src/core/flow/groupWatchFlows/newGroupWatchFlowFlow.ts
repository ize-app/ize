import { FlowType, Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { DecisionType, GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { newGroupWatchFlowFlowVersion } from "./newWatchFlowFlowVersion";
import { newEvolveFlow } from "../evolveFlow/newEvolveFlow";

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
}): Promise<string | null> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const flow = await transaction.flow.create({
    data: {
      type: FlowType.GroupWatchFlow,
      reusable: true,
      creatorId: context.currentUser.id,
      groupId,
    },
  });

  const evolveFlowId = await newEvolveFlow({
    evolveArgs: {
      requestPermission: { anyone: false, entities: [{ id: groupEntityId }] },
      responsePermission: {
        anyone: false,
        entities: [{ id: context.currentUser.Identities[0].entityId }],
      },
      decision: { type: DecisionType.NumberThreshold, threshold: 1 },
    },
    creatorId: context.currentUser.id,
    transaction,
  });

  await newGroupWatchFlowFlowVersion({
    transaction,
    flowId: flow.id,
    evolveFlowId,
    active: true,
    groupEntityId,
    policy,
    context,
  });

  return flow.id;
};
