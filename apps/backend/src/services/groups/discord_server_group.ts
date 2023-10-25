import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "../../discord/api";
import { randomUUID } from "crypto";
import { Prisma, PrismaClient } from "@prisma/client";

export async function setUpDiscordServerService(
  {
    serverId,
  }: {
    serverId: string;
  },
  context: GraphqlRequestContext
) {
  const botApi = DiscordApi.forBotUser();
  const server = await botApi.getDiscordServer(serverId);
  const serverRoles = await botApi.getDiscordServerRoles(serverId);
  const everyoneRole = serverRoles.find((role) => role.name === "@everyone");

  return await prisma.$transaction(async (transaction) => {
    if (!server) {
      throw new Error("Cannot find server");
    }

    if (!everyoneRole) {
      throw new Error("Cannot find @everyone role");
    }

    const existingGroup = await transaction.group.findFirst({
      where: {
        discordRoleGroup: {
          discordServer: {
            discordServerId: serverId
          }
        }
      }
    });
  
    if (existingGroup) {
      throw new Error("Server has already been set-up");
    }

    const members = await botApi.getDiscordGuildMembers({serverId: server.id})
    const memberCount = botApi.countMembers(members)

    const discordRoleGroupId = randomUUID();

    return await transaction.group.create({
      include: { discordRoleGroup: true },
      data: {
        creatorId: context.currentUser.id,
        activeAt: new Date(),
        discordRoleGroup: {
          create: {
            id: discordRoleGroupId,
            discordRoleId: everyoneRole.id,
            color: everyoneRole.color,
            name: everyoneRole.name,
            icon: everyoneRole.icon,
            unicodeEmoji: everyoneRole.unicode_emoji,
            memberCount: memberCount,
            discordServer: {
              create: {
                discordServerId: serverId,
                icon: server.icon,
                banner: server.banner,
                name: server.name,
              }
            }
          },
        },
      },
    });

  });
}
