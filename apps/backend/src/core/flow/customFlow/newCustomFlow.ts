import { FlowType } from "@prisma/client";

import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
import { newRequest } from "@/core/request/newRequest";
import { watchFlow } from "@/core/user/watchFlow";
import { GraphqlRequestContext } from "@/graphql/context";
import { MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { newCustomFlowVersion } from "./newCustomFlowVersion";
import { prisma } from "../../../prisma/client";
import { newEvolveFlow } from "../evolveFlow/newEvolveFlow";

export const newCustomFlow = async ({
  args,
  context,
}: {
  args: MutationNewFlowArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const creatorId = context.currentUser.id;
  let evolveFlowId: string | null = null;
  const flowId = await prisma.$transaction(async (transaction) => {
    if (!args.flow.evolve && args.flow.reusable)
      throw new GraphQLError("Reusable flows must include evolve flow arguments.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });

    if (args.flow.evolve && args.flow.reusable) {
      evolveFlowId = await newEvolveFlow({
        evolveArgs: args.flow.evolve,
        creatorId,
        transaction,
      });
    }

    const flow = await transaction.flow.create({
      data: { type: FlowType.Custom, reusable: args.flow.reusable, creatorId },
    });

    if (!args.flow.reusable) {
      // non-reusable flows are triggered automatically after creation
      // creator of flow is only one with permission to trigger flow
      if (args.flow.steps[0].request && context.currentUser) {
        args.flow.steps[0].request.permission = {
          anyone: false,
          entities: [{ id: context.currentUser.entityId }],
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

  await createWatchFlowRequests({ flowId, context });

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
      context,
    });
    return requestId;
  } else {
    await watchFlow({ flowId, watch: true, userId: context.currentUser.id });
    return flowId;
  }
};
