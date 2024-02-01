import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// looks whether there are any custom groups for a given identity or set of groups associated with that identity
// (e.g. discord role groups for a discord identity)
export const getCustomGroupsForIdentity = async ({
  identityId,
  groupIds,
  transaction = prisma,
}: {
  identityId: string;
  groupIds: string[];
  transaction?: Prisma.TransactionClient;
}) => {
  const identityCustomGroups = await transaction.groupCustom.findMany({
    where: {
      OR: [
        {
          CustomGroupMemberGroups: {
            some: {
              Group: { id: { in: groupIds } },
            },
          },
        },
        {
          CustomGroupMemberIdentities: {
            some: {
              identityId: identityId,
            },
          },
        },
      ],
    },
  });

  return identityCustomGroups.map((group) => group.groupId);
};
