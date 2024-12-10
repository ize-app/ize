import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

export const upsertEntityGroup = async ({
  entityId,
  groupId,
  active,
  transaction = prisma,
}: {
  entityId: string;
  groupId: string;
  active: boolean;
  transaction?: Prisma.TransactionClient;
}) => {
  try {
    await transaction.entityGroup.upsert({
      where: { entityId_groupId: { entityId, groupId } },
      update: {
        active,
      },
      create: {
        entityId,
        groupId,
        active,
      },
    });
  } catch (e) {
    console.log("ERROR updateIdentityGroups: ", e);
  }
};
