import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";

// looks whether there are any Ize groups for a given identity or set of groups associated with that identity
// (e.g. discord role groups for a discord identity)
export const getIzeGroupsByMembers = async ({
  identityId,
  groupIds,
  transaction = prisma,
}: {
  identityId?: string;
  groupIds: string[];
  transaction?: Prisma.TransactionClient;
}) => {
  const identityIzeGroups = await transaction.groupIze.findMany({
    where: {
      MemberEntitySet: {
        EntitySetEntities: {
          some: {
            Entity: {
              OR: [
                { Group: { id: { in: groupIds } } },
                identityId ? { Identity: { id: { equals: identityId } } } : {},
              ],
            },
          },
        },
      },
    },
  });

  return identityIzeGroups.map((group) => group.groupId);
};
