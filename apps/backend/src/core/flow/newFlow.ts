import { FlowType } from "@prisma/client";

import { getUserEntities } from "@/core/entity/getUserEntities";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
import { NewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newEvolveFlow } from "./flowTypes/evolveFlow/newEvolveFlow";
import { newFlowVersion } from "./newFlowVersion";

export const newFlow = async ({
  type,
  args,
  entityContext,
  groupId,
}: {
  type: FlowType;
  args: NewFlowArgs;
  entityContext: UserOrIdentityContextInterface;
  groupId?: string;
}): Promise<string> => {
  const { entityId } = await getUserEntities({ entityContext });

  let evolveFlowId: string | null = null;
  const flowId = await prisma.$transaction(async (transaction) => {
    // reusable flows need evolve flow arguments
    // unless the flow itself is an evolve flow, which evolves itself
    if (!args.evolve && args.reusable && type !== FlowType.Evolve)
      throw new GraphQLError("Reusable flows must include evolve flow arguments.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });

    if (args.evolve && args.reusable) {
      if (type === FlowType.Evolve) evolveFlowId = flowId;
      else
        evolveFlowId = await newEvolveFlow({
          evolveArgs: args.evolve,
          creatorEntityId: entityId,
          transaction,
          entityContext,
        });
    }

    const flow = await transaction.flow.create({
      data: {
        type,
        reusable: args.reusable,
        creatorEntityId: entityId,
        groupId,
      },
    });

    if (!args.reusable) {
      // non-reusable flows are triggered automatically after creation
      // creator of flow is only one with permission to trigger flow
      if (args.trigger) {
        args.trigger.permission = {
          anyone: false,
          entities: [{ id: entityId }],
        };
        args.fieldSet = { fields: [], locked: false };
      }
      // non-reusable flows can't be evolve
      args.evolve = undefined;
    }

    await newFlowVersion({
      transaction,
      flowArgs: args,
      flowId: flow.id,
      evolveFlowId,
      active: true,
      draftEvolveFlowVersionId: null,
    });

    return flow.id;
  });

  if (type === FlowType.Custom) await createWatchFlowRequests({ flowId, entityContext });

  return flowId;
};
