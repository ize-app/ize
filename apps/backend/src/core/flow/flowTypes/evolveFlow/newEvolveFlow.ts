import { FlowType, Prisma } from "@prisma/client";

import { EvolveFlowArgs } from "@/graphql/generated/resolver-types";

import { newEvolveFlowVersion } from "./newEvolveFlowVersion";

export const newEvolveFlow = async ({
  evolveArgs,
  creatorEntityId,
  transaction,
}: {
  evolveArgs: EvolveFlowArgs;
  creatorEntityId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  const flow = await transaction.flow.create({
    data: { type: FlowType.Evolve, reusable: true, creatorEntityId },
  });

  await newEvolveFlowVersion({ transaction, flowId: flow.id, evolveArgs, active: true });

  return flow.id;
};
