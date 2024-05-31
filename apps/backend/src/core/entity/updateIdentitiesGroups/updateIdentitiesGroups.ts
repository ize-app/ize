import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// this query updates cache mapping of groupIds to identities
// the cache is only used for read operations, not writes
// unfortunately prisma doesn't support upsertMany so the queries a bit wonky/inefficient
export const updateIdentitiesGroups = async ({
  identityId,
  groupIds,
  transaction = prisma,
}: {
  identityId: string;
  groupIds: string[];
  transaction?: Prisma.TransactionClient;
}) => {
  await transaction.identityGroup.updateMany({
    where: {
      identityId,
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
