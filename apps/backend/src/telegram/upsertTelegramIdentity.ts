import { TelegramUserData } from "@telegram-auth/server/utils";
import { GraphQLError } from "graphql";

import { CustomErrorCodes } from "@/graphql/errors";
import { Identity } from "@/graphql/generated/resolver-types";

import { IdentityPrismaType } from "../core/entity/identity/identityPrismaTypes";
import { identityResolver } from "../core/entity/identity/identityResolver";
import { prisma } from "../prisma/client";

export const upsertTelegramIdentity = async ({
  telegramUserData,
  userId,
}: {
  telegramUserData: TelegramUserData;
  userId: string;
}): Promise<Identity | null> => {
  if (!userId)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  let identity = await prisma.identity.findFirst({
    include: {
      IdentityTelegram: true,
    },
    where: {
      IdentityTelegram: {
        telegramUserId: telegramUserData.id,
      },
    },
  });

  if (!identity) {
    identity = await prisma.identity.create({
      include: {
        IdentityTelegram: true,
      },
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        Entity: {
          create: {},
        },
        IdentityTelegram: {
          create: {
            firstName: telegramUserData.first_name,
            lastName: telegramUserData.last_name,
            username: telegramUserData.username,
            photoUrl: telegramUserData.photo_url,
            telegramUserId: telegramUserData.id,
          },
        },
      },
    });
  }
  return identityResolver(identity as IdentityPrismaType, [], false);
};
