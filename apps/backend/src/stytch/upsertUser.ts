import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { userInclude, UserPrismaType } from "@/core/user/userPrismaTypes";
import { User as StytchUser } from "stytch";

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
