import { GroupType, Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// this query updates cache mapping of groupIds to identities
// the cache is only used for read operations, not writes
// unfortunately prisma doesn't support upsertMany so the queries a bit wonky/inefficient
export const updateEntitiesGroups = async ({
  entityId,
  groupIds,
  groupType,
  transaction = prisma,
}: {
  entityId: string;
  groupIds: string[];
  groupType: GroupType;
  transaction?: Prisma.TransactionClient;
}) => {
  // reset all groups to inactive to reflect when a user is no longer part of a group
  await transaction.entityGroup.updateMany({
    where: {
      entityId,
      Group: {
        type: groupType,
      },
    },
    data: {
      active: false,
    },
  });

  await transaction.entityGroup.createMany({
    data: groupIds.map((groupId) => ({
      groupId,
      active: true,
      entityId,
    })),
    skipDuplicates: true,
  });

  await transaction.entityGroup.updateMany({
    where: {
      entityId,
      groupId: { in: groupIds },
    },
    data: {
      active: true,
    },
  });
};
