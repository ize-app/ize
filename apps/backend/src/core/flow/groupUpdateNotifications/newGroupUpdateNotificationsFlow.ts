import { FlowType, Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { DecisionType } from "@/graphql/generated/resolver-types";

import { newGroupUpdateNotificationsFlowVersion } from "./newGroupUpdateNotificationsFlowVersion";
import { newEvolveFlow } from "../evolveFlow/newEvolveFlow";

export const newGroupUpdateNotificationsFlow = async ({
  groupEntityId,
  groupId,
  context,
  transaction,
}: {
  context: GraphqlRequestContext;
  groupId: string;
  groupEntityId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  const flow = await transaction.flow.create({
    data: { type: FlowType.GroupUpdateNotifications, creatorId: context.currentUser.id, groupId },
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

  await newGroupUpdateNotificationsFlowVersion({
    transaction,
    flowId: flow.id,
    evolveFlowId,
    active: true,
    groupEntityId,
    context,
  });

  return flow.id;
};
