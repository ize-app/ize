import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma/client";
import { MePrismaType } from "@/core/user/userPrismaTypes";

export const getGroupIdsOfUser = async ({
  user,
  transaction = prisma,
}: {
  user: MePrismaType | undefined | null;
  transaction?: Prisma.TransactionClient;
}): Promise<string[]> => {
  if (!user) return [];
  const identityIds = user.Identities.map((id) => id.id);
  const resp = await transaction.identityGroup.findMany({
    where: {
      active: true,
      identityId: { in: identityIds },
    },
  });
  return resp.map((identityGroup) => identityGroup.groupId);
};
