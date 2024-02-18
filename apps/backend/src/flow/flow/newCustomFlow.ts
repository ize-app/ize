import { MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { newStep } from "./helpers/newStep";
import { FlowType } from "@prisma/client";
import { newEvolveFlow } from "./newEvolveFlow";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newCustomFlow = async ({ args }: { args: MutationNewFlowArgs }): Promise<string> => {
  let evolveFlowId: string | null = null;
  return await prisma.$transaction(async (transaction) => {
    if (!args.flow.evolve && args.flow.reusable)
      throw new GraphQLError("Reusable flows must include evolve flow arguments.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });

    if (args.flow.evolve) {
      evolveFlowId = await newEvolveFlow({
        evolveArgs: args.flow.evolve,
        transaction,
      });
    }

    const flow = await transaction.flow.create({
      data: { type: FlowType.Custom },
    });

    const flowVersion = await transaction.flowVersion.create({
      data: {
        name: args.flow.name,
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

    await Promise.all(
      args.flow.steps.map(async (step, index) => {
        await newStep({
          args: step,
          transaction,
          flowVersionId: flowVersion.id,
          index,
          reusable: args.flow.reusable,
        });
      }),
    );

    return flow.id;
  });
};
