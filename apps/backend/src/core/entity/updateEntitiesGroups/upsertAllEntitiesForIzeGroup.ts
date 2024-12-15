import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// this updates all entity groups for a given group Type and a given user
// unfortunately prisma doesn't support upsertMany so the queries a bit wonky/inefficient
export const upsertAllMemberEntitiesForIzeGroup = async ({
  entityIds,
  groupId,
  transaction = prisma,
}: {
  entityIds: string[];
  groupId: string;
  transaction?: Prisma.TransactionClient;
}) => {

  const memberEntities = await transaction.entityGroup.findMany({
    where: {
      active: true,
      Group: {
        entityId: { in: entityIds },
      },
    },
  });

  const memberEntityIds = memberEntities.map((entity) => entity.entityId);

  const allEntityIds = [...entityIds, ...memberEntityIds];

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
    data: allEntityIds.map((entityId) => ({
      groupId,
      active: true,
      entityId,
    })),
    skipDuplicates: true,
  });

  await transaction.entityGroup.updateMany({
    where: {
      entityId: { in: allEntityIds },
      groupId,
    },
    data: {
      active: true,
    },
  });
};
