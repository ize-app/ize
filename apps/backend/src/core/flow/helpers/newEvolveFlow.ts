import { EvolveFlowArgs } from "@/graphql/generated/resolver-types";
import { FlowType, Prisma } from "@prisma/client";
import { newEvolveFlowVersion } from "./newEvolveFlowVersion";

export const newEvolveFlow = async ({
  evolveArgs,
  creatorId,
  transaction,
}: {
  evolveArgs: EvolveFlowArgs;
  creatorId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  const flow = await transaction.flow.create({
    data: { type: FlowType.Evolve, creatorId },
  });

  await newEvolveFlowVersion({ transaction, flowId: flow.id, evolveArgs, draft: false });

  return flow.id;
};
