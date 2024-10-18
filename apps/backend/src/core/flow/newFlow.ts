import { FlowType } from "@prisma/client";

import { getUserEntities } from "@/core/entity/getUserEntities";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
import { newRequest } from "@/core/request/newRequest";
import { watchFlow } from "@/core/user/watchFlow";
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
  const { entityId, user } = await getUserEntities({ entityContext });

  let evolveFlowId: string | null = null;
  const flowId = await prisma.$transaction(async (transaction) => {
    if (!args.evolve && args.reusable)
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
        args.steps[0].fieldSet = { fields: [], locked: false };
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

  if (!args.reusable) {
    const requestId = await newRequest({
      args: {
        request: {
          flowId: flowId,
          name: args.requestName ?? args.name ?? "",
          requestFields: [],
          requestDefinedOptions: [],
        },
      },
      entityContext,
    });
    return requestId;
  } else {
    // creating a request also watches flow so not calling that for nonreusable flow block

    if (type === FlowType.Custom) await watchFlow({ flowId, watch: true, entityId, user });
    return flowId;
  }
};
