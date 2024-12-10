import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// this updates all entity groups for a given group Type and a given user
// unfortunately prisma doesn't support upsertMany so the queries a bit wonky/inefficient
export const upsertAllEntitiesForGroup = async ({
  entityIds,
  groupId,
  transaction = prisma,
}: {
  entityIds: string[];
  groupId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  // reset all groups to inactive to reflect when a user is no longer part of a group
  await transaction.entityGroup.updateMany({
    where: {
      groupId,
    },
    data: {
      active: false,
    },
  });

  await transaction.entityGroup.createMany({
    data: entityIds.map((entityId) => ({
      groupId,
      active: true,
      entityId,
    })),
    skipDuplicates: true,
  });

  await transaction.entityGroup.updateMany({
    where: {
      entityId: { in: entityIds },
      groupId,
    },
    data: {
      active: true,
    },
  });
};
