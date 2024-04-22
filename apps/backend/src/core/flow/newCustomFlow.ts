import { MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { newStep } from "./helpers/newStep";
import { FlowType } from "@prisma/client";
import { newEvolveFlow } from "./helpers/newEvolveFlow";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { StepPrismaType } from "./flowPrismaTypes";

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

    const flowVersion = await transaction.flowVersion.create({
      data: {
        name: args.flow.name,
        totalSteps: args.flow.steps.length,
        reusable: args.flow.reusable,
        EvolveFlow: evolveFlowId
          ? {
              connect: {
                id: evolveFlowId,
              },
            }
          : undefined,
        FlowForCurrentVersion: {
          connect: {
            id: flow.id,
          },
        },
        Flow: {
          connect: {
            id: flow.id,
          },
        },
      },
    });

    const createdSteps: StepPrismaType[] = [];

    // executing in sequence because steps can reference previous steps
    for (let i = 0; i <= args.flow.steps.length - 1; i++) {
      const step = args.flow.steps[i];
      await newStep({
        args: step,
        transaction,
        flowVersionId: flowVersion.id,
        index: i,
        createdSteps,
        reusable: args.flow.reusable,
      });
    }

    return flow.id;
  });
};
