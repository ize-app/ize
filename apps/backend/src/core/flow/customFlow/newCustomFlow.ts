import { FlowType } from "@prisma/client";

import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
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

    if (args.flow.evolve) {
      evolveFlowId = await newEvolveFlow({
        evolveArgs: args.flow.evolve,
        creatorId,
        transaction,
      });
    }

    const flow = await transaction.flow.create({
      data: { type: FlowType.Custom, reusable: args.flow.reusable, creatorId },
    });

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

  createWatchFlowRequests({ flowId, context });

  return flowId;
};
