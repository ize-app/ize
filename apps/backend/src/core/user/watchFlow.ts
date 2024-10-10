import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";

export const watchFlow = async ({
  entityId,
  flowId,
  watch,
  transaction = prisma,
}: {
  entityId: string;
  flowId: string;
  watch: boolean;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  await transaction.entityWatchedFlows.upsert({
    where: {
      entityId_flowId: {
        flowId,
        entityId,
      },
    },
    create: { flowId: flowId, entityId, watched: watch },
    update: { watched: watch },
  });
  return watch;
};
