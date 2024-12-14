import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";

// watch or unwatch multiple flows for a given entity
export const updateEntityWatchFlows = async ({
  entityId,
  flowIds,
  watch,
  transaction = prisma,
}: {
  entityId: string;
  flowIds: string[];
  watch: boolean;
  transaction?: Prisma.TransactionClient;
}): Promise<void> => {
  await Promise.all(
    flowIds.map(async (flowId) => {
      return await transaction.entityWatchedFlows.upsert({
        where: {
          entityId_flowId: {
            flowId,
            entityId,
          },
        },
        create: { flowId: flowId, entityId, watched: watch },
        update: { watched: watch },
      });
    }),
  );
  return;
};
