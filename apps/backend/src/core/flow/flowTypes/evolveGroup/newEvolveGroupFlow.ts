import { FlowType, Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import { DecisionType, GroupFlowPolicyArgs } from "@/graphql/generated/resolver-types";

import { createEvolveGroupFlowVersionArgs } from "./createEvolveGroupFlowVersionArgs";
import { newStep } from "../../helpers/newStep";
import { newEvolveFlow } from "../evolveFlow/newEvolveFlow";

export const newEvolveGroupFlow = async ({
  groupEntityId,
  groupId,
  context,
  policy,
  transaction,
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

  const flow = await transaction.flow.create({
    data: {
      type: FlowType.EvolveGroup,
      reusable: true,
      creatorEntityId: context.currentUser.entityId,
      groupId,
    },
  });

  const evolveFlowId = await newEvolveFlow({
    evolveArgs: {
      requestPermission: { anyone: false, entities: [{ id: groupEntityId }] },
      responsePermission: {
        anyone: false,
        entities: [{ id: context.currentUser.entityId }],
      },
      decision: { type: DecisionType.NumberThreshold, threshold: 1 },
    },
    creatorEntityId: context.currentUser.id,
    transaction,
  });

  await newEvolveGroupFlowVersion({
    transaction,
    policy,
    flowId: flow.id,
    evolveFlowId,
    active: true,
    groupEntityId,
    context,
  });

  return flow.id;
};

export const newEvolveGroupFlowVersion = async ({
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
  policy: GroupFlowPolicyArgs;
  context: GraphqlRequestContext;
  groupEntityId: string;
}): Promise<string> => {
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: "Evolve group",
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
    args: createEvolveGroupFlowVersionArgs({ groupEntityId, context, policy }),
    transaction,
    flowVersionId: flowVersion.id,
    index: 0,
    createdSteps: [],
    reusable: true,
  });

  return flowVersion.id;
};
