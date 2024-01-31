import { DiscordApi } from "@/discord/api";
import { GraphqlRequestContext } from "../../../graphql/context";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

// adds all roles from a server with the Ize bot to Ize
// this function is only called for servers that have added the Ize bot
// which allows our API to see their roles
export const refreshDiscordServerRoles = async ({
  serverId,
  context,
  transaction = prisma,
}: {
  serverId: string;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  const botApi = DiscordApi.forBotUser();
  const server = await botApi.getDiscordServer(serverId);
  const serverRoles = await botApi.getDiscordServerRoles(serverId);
  const members = await botApi.getDiscordGuildMembers({
    serverId: server.id,
  });

  const memberCount = botApi.countRoleMembers(members, serverRoles);

  const relevantRoles = serverRoles.filter(
    (role) => !role.tags?.bot_id || role.name === "@everyone",
  );

  const everyoneRoleId = relevantRoles.find((role) => role.name === "@everyone")?.id;
  if (!everyoneRoleId) throw Error("ERROR: Cannot find @everyone role");

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

  // before a server onboards the Ize bot (allowing our API to see their roles)
  // we allow users to assign a role to the "@everyone" role without yet knowing the discord role ID
  // once the Ize bot is added, we need to add the role id to that role
  // using updateMany here so it doesn't throw an error if there is no everyone role
  await transaction.groupDiscordRole.updateMany({
    where: {
      // discordServerId_name: { name: "@everyone", discordServerId: serverRecord.id },
      name: "@everyone",
      discordServerId: serverRecord.id,
    },
    data: {
      discordRoleId: everyoneRoleId,
    },
  });

  await Promise.all(
    relevantRoles.map(async (role) => {
      return await transaction.groupDiscordRole.upsert({
        where: {
          discordServerId_discordRoleId: {
            discordServerId: serverRecord.id, // refers to internal db id
            discordRoleId: role.id, // refers to Discord's own role id
          },
        },
        update: {
          name: role.name,
          discordRoleId: role.id,
          color: role.color,
          icon: role.icon,
          unicodeEmoji: role.unicode_emoji,
          memberCount: memberCount[role.id],
        },
        create: {
          name: role.name,
          discordRoleId: role.id,
          color: role.color,
          icon: role.icon,
          unicodeEmoji: role.unicode_emoji,
          memberCount: memberCount[role.id],
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
    }),
  );
};
