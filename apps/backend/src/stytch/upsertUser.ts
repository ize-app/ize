import { Prisma } from "@prisma/client";
import { User as StytchUser } from "stytch";

import { UserPrismaType, userInclude } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";

export const upsertUser = async ({
  stytchUser,
  // transaction = prisma,
}: {
  stytchUser: StytchUser;
  transaction?: Prisma.TransactionClient;
}): Promise<UserPrismaType> => {
  const user = await prisma.user.upsert({
    include: userInclude,
    where: {
      stytchId: stytchUser.user_id,
    },
    update: {},
    create: {
      stytchId: stytchUser.user_id,
      firstName: stytchUser.name?.first_name ?? null,
      lastName: stytchUser.name?.last_name ?? null,
    },
  });
  return user;
};
