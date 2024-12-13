import { TelegramUserData } from "@telegram-auth/server/utils";

import { getTelegramIdentityChatGroups } from "./getTelegramIdentityChatGroups";
import { IdentityPrismaType, identityInclude } from "../core/entity/identity/identityPrismaTypes";
import { prisma } from "../prisma/client";

export const upsertTelegramIdentity = async ({
  telegramUserData,
  userId,
}: {
  telegramUserData: TelegramUserData;
  userId?: string | undefined;
}): Promise<IdentityPrismaType> => {
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
      include: identityInclude,
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
            username: telegramUserData.username,
            photoUrl: telegramUserData.photo_url,
            telegramUserId: telegramUserData.id,
          },
        },
      },
    });
    getTelegramIdentityChatGroups(identity.IdentityTelegram, identity.entityId);
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
            username: telegramUserData.username ?? identity.IdentityTelegram?.username,
            photoUrl: telegramUserData.photo_url ?? identity.IdentityTelegram?.photoUrl,
            telegramUserId: telegramUserData.id ?? identity.IdentityTelegram?.telegramUserId,
          },
        },
      },
    });
  }
  return identity as IdentityPrismaType;
};
