import { Prisma } from "@prisma/client";
import { Response } from "express";
import { User as StytchUser } from "stytch";

import { UserPrismaType, meInclude } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";

export const upsertUser = async ({
  stytchUser,
  res,
  // transaction = prisma,
}: {
  stytchUser: StytchUser;
  res: Response;
  transaction?: Prisma.TransactionClient;
}): Promise<UserPrismaType> => {
  let user = await prisma.user.findFirst({
    include: meInclude,
    where: {
      stytchId: stytchUser.user_id,
    },
  });

  if (!user) {
    res.cookie("new_user", "true", { maxAge: 1000 * 60 * 24 });

    user = await prisma.user.create({
      data: {
        stytchId: stytchUser.user_id,
        name:
          (stytchUser.name?.first_name ? stytchUser.name?.first_name + " " : "") +
          (stytchUser.name?.last_name ?? ""),
      },
      include: meInclude,
    });
  }

  return user;
};
