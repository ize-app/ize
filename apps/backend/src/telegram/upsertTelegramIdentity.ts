import { TelegramUserData } from "@telegram-auth/server/utils";

import { Identity } from "@/graphql/generated/resolver-types";

import { IdentityPrismaType } from "../core/entity/identity/identityPrismaTypes";
import { identityResolver } from "../core/entity/identity/identityResolver";
import { prisma } from "../prisma/client";

export const upsertTelegramIdentity = async ({
  telegramUserData,
  userId,
}: {
  telegramUserData: TelegramUserData;
  userId?: string | undefined;
}): Promise<Identity> => {
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
        User: userId
          ? {
              connect: {
                id: userId,
              },
            }
          : {},
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
  } else {
    identity = await prisma.identity.update({
      include: {
        IdentityTelegram: true,
      },
      where: {
        id: identity.id,
      },
      data: {
        User: userId
          ? {
              connect: {
                id: userId,
              },
            }
          : {},
        IdentityTelegram: {
          update: {
            firstName: telegramUserData.first_name ?? identity.IdentityTelegram?.firstName,
            lastName: telegramUserData.last_name ?? identity.IdentityTelegram?.lastName,
            username: telegramUserData.username ?? identity.IdentityTelegram?.username,
            photoUrl: telegramUserData.photo_url ?? identity.IdentityTelegram?.photoUrl,
            telegramUserId: telegramUserData.id ?? identity.IdentityTelegram?.telegramUserId,
          },
        },
      },
    });
  }

  return identityResolver(identity as IdentityPrismaType, [], false);
};
