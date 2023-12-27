import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "@discord/api";

const getDiscordGroupIds = async (context: GraphqlRequestContext): Promise<string[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  if (!context.discordApi) return [];

  const discordIdentity = context.currentUser.Identities.find((identity) => {
    return !!identity.IdentityDiscord;
  });

  const userDiscordData = await prisma.identityDiscord.findFirstOrThrow({
    where: { identityId: discordIdentity?.IdentityDiscord?.identityId },
  });

  const botApi = DiscordApi.forBotUser();

  // Get the servers for the user using the users' API token
  const userGuilds = await context.discordApi.getDiscordServers();

  // Get the roles for the user in those servers
  // Only pulls roles that discord bot has access to (i.e. roles of servers that have bot installed)
  const userGuildMembers = await Promise.all(
    userGuilds.map(async (guild) => {
      return botApi.getDiscordGuildMember({
        serverId: guild.id,
        memberId: userDiscordData.discordUserId,
      });
    }),
  );

  // converting to Set to remove many duplicate "undefined" roleIds
  const roleIds = [...new Set(userGuildMembers.map((member) => member.roles).flat())];

  // Get groups that the user is in a server, role or has created.
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { discordRoleGroup: { discordRoleId: { in: roleIds } } },
        // @everyone isn't part of roleIds returned from discord API
        { discordRoleGroup: { name: "@everyone" } },
        { creatorId: context.currentUser.id },
      ],
    },
  });

  return groups.map((group) => group.id);
};

export const getGroupIdsOfUserService = async (context: GraphqlRequestContext) => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const discordGroupIds = await getDiscordGroupIds(context);

  return discordGroupIds;
};
