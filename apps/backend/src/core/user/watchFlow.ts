import { Prisma } from "@prisma/client";

export const watchFlow = async ({
  flowId,
  userId,
  watch,
  transaction,
}: {
  flowId: string;
  userId: string;
  watch: boolean;
  transaction: Prisma.TransactionClient;
}): Promise<boolean> => {
  await transaction.usersWatchedFlows.upsert({
    where: {
      userId_flowId: {
        flowId,
        userId,
      },
    },
    create: { flowId: flowId, userId, watched: watch },
    update: { watched: watch },
  });
  return watch;
};
