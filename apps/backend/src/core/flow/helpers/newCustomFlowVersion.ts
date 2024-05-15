import { NewFlowArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newStep } from "./newStep";
import { StepPrismaType } from "../flowPrismaTypes";

export const newCustomFlowVersion = async ({
  transaction,
  flowArgs,
  evolveFlowId,
  flowId,
  draft,
}: {
  transaction: Prisma.TransactionClient;
  flowArgs: NewFlowArgs;
  flowId: string;
  evolveFlowId: string | null;
  draft: boolean;
}) => {
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: flowArgs.name,
      draft,
      totalSteps: flowArgs.steps.length,
      reusable: flowArgs.reusable,
      EvolveFlow: evolveFlowId
        ? {
            connect: {
              id: evolveFlowId,
            },
          }
        : undefined,
      FlowForCurrentVersion: {
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

  const createdSteps: StepPrismaType[] = [];

  // executing in sequence because steps can reference previous steps
  for (let i = 0; i <= flowArgs.steps.length - 1; i++) {
    const step = flowArgs.steps[i];
    await newStep({
      args: step,
      transaction,
      flowVersionId: flowVersion.id,
      index: i,
      createdSteps,
      reusable: flowArgs.reusable,
    });
  }
};
