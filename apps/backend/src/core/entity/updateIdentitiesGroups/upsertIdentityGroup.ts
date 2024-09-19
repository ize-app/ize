import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";


export const updateIdentityGroups = async ({
  identityId,
  groupId,
  active,
  transaction = prisma,
}: {
  identityId: string;
  groupId: string;
  active: boolean;
  transaction?: Prisma.TransactionClient;
}) => {
  try {
    await transaction.identityGroup.upsert({
      where: { identityId_groupId: { identityId, groupId } },
      update: {
        active,
      },
      create: {
        identityId,
        groupId,
        active,
      },
    });
  } catch (e) {
    console.log("ERROR updateIdentityGroups: ", e);
  }
};
