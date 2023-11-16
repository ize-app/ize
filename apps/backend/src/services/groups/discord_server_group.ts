import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "../../discord/api";

export async function setUpDiscordServerService(
  {
    serverId,
    roleId,
  }: {
    serverId: string;
    roleId?: string;
  },
  context: GraphqlRequestContext,
) {
  const botApi = DiscordApi.forBotUser();
  const server = await botApi.getDiscordServer(serverId);
  const serverRoles = await botApi.getDiscordServerRoles(serverId);

  return await prisma.$transaction(async (transaction) => {
    if (!server) {
      throw new Error("Cannot find server");
    }

    const existingGroup = await transaction.group.findFirst({
      where: {
        discordRoleGroup: {
          discordServer: {
            discordServerId: serverId,
          },
        },
      },
    });

    if (existingGroup) {
      throw new Error("Server has already been set-up");
    }

    const serverRecord = await transaction.discordServer.create({
      data: {
        discordServerId: serverId,
        icon: server.icon,
        banner: server.banner,
        name: server.name,
      },
    });

    const members = await botApi.getDiscordGuildMembers({
      serverId: server.id,
    });

    const memberCount = botApi.countRoleMembers(members, serverRoles);

    const relevantGroups = serverRoles.filter(
      (role) => !role.tags?.bot_id || role.name === "@everyone",
    );

    await Promise.all(
      relevantGroups.map((group) => {
        return transaction.group.create({
          data: {
            creatorId: context.currentUser.id,
            activeAt: new Date(),
            discordRoleGroup: {
              create: {
                discordRoleId: group.id,
                color: group.color,
                name: group.name,
                icon: group.icon,
                unicodeEmoji: group.unicode_emoji,
                memberCount: memberCount[group.id],
                discordServerId: serverRecord.id,
              },
            },
          },
        });
      }),
    );

    return await transaction.group.findFirst({
      include: {
        discordRoleGroup: {
          include: {
            discordServer: true,
          },
        },
      },
      where: {
        discordRoleGroup: {
          discordServerId: serverRecord.id,
          name: "@everyone",
        },
      },
    });
  });
}
