import { Prisma } from "@prisma/client";
import { APIUser } from "discord.js";

// get Discord user data from Discord API and create Discord identity for user
export const upsertUserDiscordIdentity = async ({
  userId,
  accessToken,
  transaction,
}: {
  userId: string;
  accessToken: string;
  transaction: Prisma.TransactionClient;
}) => {
  const discordUser = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { id, username, avatar, discriminator } = (await discordUser.json()) as APIUser;

  const existingIdentity = await transaction.identityDiscord.findFirst({
    where: {
      discordUserId: id,
    },
  });

  if (existingIdentity) {
    await transaction.identity.update({
      where: {
        id: existingIdentity.identityId,
      },
      data: {
        userId: userId,
        IdentityDiscord: {
          update: {
            username,
            avatar,
            discriminator,
          },
        },
      },
    });
  } else {
    await transaction.identity.create({
      data: {
        Entity: {
          create: {},
        },
        User: {
          connect: { id: userId },
        },
        IdentityDiscord: {
          create: {
            discordUserId: id,
            username,
            avatar,
            discriminator,
          },
        },
      },
    });
  }
};
