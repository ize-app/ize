import { EvolveFlowArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newStep } from "./newStep";
import { createEvolveStepArgs } from "./createEvolveStepArgs";

export const newEvolveFlowVersion = async ({
  transaction,
  flowId,
  evolveArgs,
  draft,
}: {
  transaction: Prisma.TransactionClient;
  flowId: string;
  evolveArgs: EvolveFlowArgs;
  draft: boolean;
}): Promise<string> => {
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: "Evolve flow",
      totalSteps: 1,
      reusable: true,
      draft,
      // evolve flow has evolve rights over itself.
      EvolveFlow: {
        connect: {
          id: flowId,
        },
      },
      FlowForCurrentVersion: draft
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
    args: createEvolveStepArgs(evolveArgs),
    transaction,
    flowVersionId: flowVersion.id,
    index: 0,
    createdSteps: [],
    reusable: true,
  });

  return flowVersion.id;
};
