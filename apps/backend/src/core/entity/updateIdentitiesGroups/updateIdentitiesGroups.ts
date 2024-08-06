import { GroupType, Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// this query updates cache mapping of groupIds to identities
// the cache is only used for read operations, not writes
// unfortunately prisma doesn't support upsertMany so the queries a bit wonky/inefficient
export const updateIdentitiesGroups = async ({
  identityId,
  groupIds,
  groupType,
  transaction = prisma,
}: {
  identityId: string;
  groupIds: string[];
  groupType: GroupType;
  transaction?: Prisma.TransactionClient;
}) => {
  // reset all groups to inactive to reflect when a user is no longer part of a group
  await transaction.identityGroup.updateMany({
    where: {
      identityId,
      Group: {
        type: groupType,
      },
    },
    data: {
      active: false,
    },
  });

  await transaction.identityGroup.createMany({
    data: groupIds.map((groupId) => ({
      groupId,
      active: true,
      identityId,
    })),
    skipDuplicates: true,
  });

  await transaction.identityGroup.updateMany({
    where: {
      identityId,
      groupId: { in: groupIds },
    },
    data: {
      active: true,
    },
  });
};
