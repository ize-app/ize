import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// looks whether there are any Ize groups for a given identity or set of groups associated with that identity
// (e.g. discord role groups for a discord identity)
export const getIzeGroupsByMembers = async ({
  entityId,
  groupEntityIdsForEntity,
  transaction = prisma,
}: {
  entityId: string;
  groupEntityIdsForEntity: string[];
  transaction?: Prisma.TransactionClient;
}) => {
  const allEntityIds = [entityId, ...groupEntityIdsForEntity];

  const identityIzeGroups = await transaction.groupIze.findMany({
    where: {
      MemberEntitySet: {
        EntitySetEntities: {
          some: {
            entityId: { in: allEntityIds },
          },
        },
      },
    },
  });

  return identityIzeGroups.map((group) => group.groupId);
};
