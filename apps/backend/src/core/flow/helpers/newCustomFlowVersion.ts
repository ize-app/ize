import { Prisma } from "@prisma/client";

import { NewFlowArgs } from "@/graphql/generated/resolver-types";

import { newStep } from "./newStep";
import { StepPrismaType } from "../flowPrismaTypes";

export const newCustomFlowVersion = async ({
  transaction,
  flowArgs,
  evolveFlowId,
  flowId,
  active,
  // each flow references an evolve flow id, not an evolve flow version id
  // when we are evolving a flow and or it's corresponding evolve flow
  // we need to know whether the evolve flow itself has been evolved as part of that draft
  draftEvolveFlowVersionId,
}: {
  transaction: Prisma.TransactionClient;
  flowArgs: NewFlowArgs;
  flowId: string;
  evolveFlowId: string | null;
  active: boolean;
  draftEvolveFlowVersionId: string | null;
}): Promise<string> => {
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: flowArgs.name,
      active,
      totalSteps: flowArgs.steps.length,
      reusable: flowArgs.reusable,
      publishedAt: !active ? null : new Date(),
      DraftEvolveFlowVersion: draftEvolveFlowVersionId
        ? { connect: { id: draftEvolveFlowVersionId } }
        : undefined,
      EvolveFlow: evolveFlowId
        ? {
            connect: {
              id: evolveFlowId,
            },
          }
        : undefined,
      FlowForCurrentVersion: !active
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

  return flowVersion.id;
};
