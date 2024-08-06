import { GroupType, Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";

import { GraphqlRequestContext } from "../../../../graphql/context";

// this function upserts @everyone role for servers that have not yet
// added the Ize bots (meaning we can't see their roles / roleIds via the Discord API)
export const newDiscordEveryoneRole = async ({
  serverId,
  context,
  transaction = prisma,
}: {
  serverId: string;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  if (!context.discordApi) throw Error("ERROR User not connected to Discord");

  const servers = await context.discordApi.getDiscordServers();
  const server = servers.find((s) => s.id === serverId);

  if (!server) throw Error("ERROR: Cannot find server");

  const serverRecord = await transaction.discordServer.upsert({
    where: {
      discordServerId: serverId,
    },
    update: {
      icon: server.icon,
      banner: server.banner,
      name: server.name,
    },
    create: {
      discordServerId: serverId,
      icon: server.icon,
      banner: server.banner,
      name: server.name,
    },
  });

  await prisma.groupDiscordRole.upsert({
    where: {
      discordServerId_name: {
        discordServerId: serverRecord.id, // refers to internal db id
        name: "@everyone",
      },
    },
    update: {},
    create: {
      name: "@everyone",
      Group: {
        create: {
          Entity: { create: {} },
          type: GroupType.DiscordRoleGroup,
          creator: {
            connect: {
              id: context.currentUser?.id as string,
            },
          },
        },
      },
      discordServer: {
        connect: {
          id: serverRecord.id,
        },
      },
    },
  });
};
