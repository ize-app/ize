import { GraphqlRequestContext } from "@graphql/context";

import { DiscordApi } from "@/discord/api";
import { GroupDiscordPrismaType } from "@/core/entity/group/formatGroup";

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
export const hasDiscordRoleGroupPermission = async ({
  discordRoleGroups,
  context,
}: {
  discordRoleGroups: GroupDiscordPrismaType[];
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  // for now, there is only one discord account per user
  const userDiscordIdentity = context.currentUser.Identities.find((id) => !!id.IdentityDiscord);
  if (!userDiscordIdentity?.IdentityDiscord?.discordUserId) return false;

  if (!context.discordApi) throw Error("No Discord authentication data for user");

  const botApi = DiscordApi.forBotUser();

  if (discordRoleGroups.length === 0) return false;

  // @everyone role and other roles are treated different
  // because @everyone role isn't returned by Discord Roles endpoint and this endpoint is only available for servers with the Ize bot.
  // @everyone role determined by whether or not user is part of that server
  // other roles determined by Discord roles endpoint
  const serverIdsForEveryoneRole = discordRoleGroups
    .filter((roleGroup) => roleGroup?.name === "@everyone")
    .map((roleGroup) => roleGroup?.discordServer.discordServerId);

  const serverIdsForOtherRoles = [
    ...new Set(
      discordRoleGroups
        .filter((roleGroup) => roleGroup?.name === "@everyone")
        .map((roleGroup) => roleGroup?.discordServer.discordServerId),
    ),
  ];

  const userServers = await context.discordApi.getDiscordServers();

  // check whether user is part of a server that has its @everyone role on the process
  const matchesEveryoneRole = serverIdsForEveryoneRole.map((serverId) =>
    userServers.some((userServer) => userServer.id === serverId),
  );
  if (matchesEveryoneRole) return true;

  // for remaining roles, we can assume they have discord bot (@everyone is the only role that doesn't require bot)
  // get users member object for each guilds. this object contains guild roles
  const userServerMembers = await Promise.all(
    serverIdsForOtherRoles.map(async (server) => {
      return botApi.getDiscordGuildMember({
        serverId: server as string,
        memberId: userDiscordIdentity?.IdentityDiscord?.discordUserId as string,
      });
    }),
  );

  //   converting to Set to remove many duplicate "undefined" roleIds
  const roleIds = [...new Set(userServerMembers.map((member) => member.roles).flat())].filter(
    (val) => !!val,
  );

  // check if roleId is in list of Discord roles
  const hasDiscordRoleGroupPermission = discordRoleGroups.some((roleGroup) =>
    roleIds.some((roleId) => roleGroup?.discordRoleId === roleId),
  );

  return hasDiscordRoleGroupPermission;
};
