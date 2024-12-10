import { Prisma } from "@prisma/client";
import { Response } from "express";
import { User as StytchUser } from "stytch";

import config from "@/config";
import { MePrismaType, meInclude } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";

export const upsertUser = async ({
  stytchUser,
  res,
  // transaction = prisma,
}: {
  stytchUser: StytchUser;
  res: Response;
  transaction?: Prisma.TransactionClient;
}): Promise<MePrismaType> => {
  // finding user first so we can distinguish new user
  let user = await prisma.user.findFirst({
    include: meInclude,
    where: {
      stytchId: stytchUser.user_id,
    },
  });

  if (!user) {
    // using upsert for race condition safety
    user = await prisma.user.upsert({
      include: meInclude,
      where: {
        stytchId: stytchUser.user_id,
      },
      update: {},
      create: {
        stytchId: stytchUser.user_id,
        Entity: config.IZE_COMMUNITY_GROUP_ID
          ? {
              create: {
                EntityWatchedGroups: {
                  create: {
                    watched: true,
                    groupId: config.IZE_COMMUNITY_GROUP_ID,
                  },
                },
              },
            }
          : { create: {} },
        name:
          (stytchUser.name?.first_name ? stytchUser.name?.first_name + " " : "") +
          (stytchUser.name?.last_name ?? ""),
      },
    });

    // for displaying new user modal
    res.cookie("new_user", "true", { maxAge: 1000 * 60 * 24 });
  }

  return user;
};
