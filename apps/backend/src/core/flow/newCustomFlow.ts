import { MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { FlowType } from "@prisma/client";
import { newEvolveFlow } from "./helpers/newEvolveFlow";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { newCustomFlowVersion } from "./helpers/newCustomFlowVersion";

export const newCustomFlow = async ({
  args,
  creatorId,
}: {
  args: MutationNewFlowArgs;
  creatorId: string;
}): Promise<string> => {
  let evolveFlowId: string | null = null;
  return await prisma.$transaction(async (transaction) => {
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
      data: { type: FlowType.Custom, creatorId },
    });

    await newCustomFlowVersion({
      transaction,
      flowArgs: args.flow,
      flowId: flow.id,
      evolveFlowId,
      draft: false,
      draftEvolveFlowVersionId: null,
    });

    return flow.id;
  });
};
