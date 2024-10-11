import { FlowType } from "@prisma/client";

import { getUserEntities } from "@/core/entity/getUserEntities";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
import { newRequest } from "@/core/request/newRequest";
import { watchFlow } from "@/core/user/watchFlow";
import { MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newCustomFlowVersion } from "./newCustomFlowVersion";
import { newEvolveFlow } from "../evolveFlow/newEvolveFlow";

export const newCustomFlow = async ({
  args,
  entityContext,
}: {
  args: MutationNewFlowArgs;
  entityContext: UserOrIdentityContextInterface;
}): Promise<string> => {
  const { entityId, user } = await getUserEntities({ entityContext });

  let evolveFlowId: string | null = null;
  const flowId = await prisma.$transaction(async (transaction) => {
    if (!args.flow.evolve && args.flow.reusable)
      throw new GraphQLError("Reusable flows must include evolve flow arguments.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });

    if (args.flow.evolve && args.flow.reusable) {
      evolveFlowId = await newEvolveFlow({
        evolveArgs: args.flow.evolve,
        creatorEntityId: entityId,
        transaction,
      });
    }

    const flow = await transaction.flow.create({
      data: {
        type: FlowType.Custom,
        reusable: args.flow.reusable,
        creatorEntityId: entityId,
      },
    });

    if (!args.flow.reusable) {
      // non-reusable flows are triggered automatically after creation
      // creator of flow is only one with permission to trigger flow
      if (args.flow.steps[0].request && user) {
        args.flow.steps[0].request.permission = {
          anyone: false,
          entities: [{ id: user.entityId }],
        };
        args.flow.steps[0].request.fields = [];
      }
      // non-reusable flows can't be evolve
      args.flow.evolve = undefined;
    }

    await newCustomFlowVersion({
      transaction,
      flowArgs: args.flow,
      flowId: flow.id,
      evolveFlowId,
      active: true,
      draftEvolveFlowVersionId: null,
    });

    return flow.id;
  });

  await createWatchFlowRequests({ flowId, entityContext });

  if (!args.flow.reusable) {
    const requestId = await newRequest({
      args: {
        request: {
          flowId: flowId,
          name: args.flow.name,
          requestFields: [],
          requestDefinedOptions: [],
        },
      },
      entityContext,
    });
    return requestId;
  } else {
    // creating a request also watches flow so not calling that for nonreusable flow block
    await watchFlow({ flowId, watch: true, entityId, user });
    return flowId;
  }
};
