import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";

import { getUserEntityIds } from "./getUserEntityIds";
import { UserPrismaType } from "./userPrismaTypes";

export const watchFlow = async ({
  entityId,
  flowId,
  watch,
  user,
  transaction = prisma,
}: {
  entityId: string;
  flowId: string;
  watch: boolean;
  user?: UserPrismaType;
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

  // if watching flow on behalf of a user, also set all their identities to watching this flow
  if (user) {
    const entityIds = getUserEntityIds(user);
    await transaction.entityWatchedFlows.updateMany({
      where: {
        flowId,
        entityId: { in: entityIds },
      },
      data: {
        watched: watch,
      },
    });
  }
  return watch;
};
