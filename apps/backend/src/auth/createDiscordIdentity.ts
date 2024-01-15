import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { APIUser } from "discord.js";

// get Discord user data from Discord API and create Discord identity for user
export const createDiscordIdentity = async ({
  userId,
  accessToken,
  transaction = prisma,
}: {
  userId: string;
  accessToken: string;
  transaction?: Prisma.TransactionClient;
}) => {
  const discordUser = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { id, username, avatar, discriminator } = (await discordUser.json()) as APIUser;

  const existingIdentity = await prisma.identityDiscord.findFirst({
    where: {
      discordUserId: id,
    },
  });

  if (existingIdentity) {
    await prisma.identity.update({
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
    await prisma.identity.create({
      data: {
        userId: userId,
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
