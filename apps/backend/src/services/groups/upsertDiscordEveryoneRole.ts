import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

// this function upserts @everyone role for servers that have not yet
// added the Cults bots (meaning we can't see their roles / roleIds via the Discord API)
export const upsertDiscordEveryoneRole = async ({
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
      group: {
        create: {
          creatorId: context.currentUser?.id as string,
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
