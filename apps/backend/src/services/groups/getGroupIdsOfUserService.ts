import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "@discord/api";

import { DiscordServer } from "@/graphql/generated/resolver-types";

export const getGroupIdsOfUserService = async ({
  discordServers,
  context,
}: {
  discordServers: DiscordServer[];
  context: GraphqlRequestContext;
}) => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const discordGroupIds = await getDiscordGroupIds({ discordServers, context });

  return discordGroupIds;
};

const getDiscordGroupIds = async ({
  discordServers,
  context,
}: {
  discordServers: DiscordServer[];
  context: GraphqlRequestContext;
}): Promise<string[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  if (!context.discordApi) return [];

  const discordIdentity = context.currentUser.Identities.find((identity) => {
    return !!identity.IdentityDiscord;
  });

  const userDiscordData = await prisma.identityDiscord.findFirstOrThrow({
    where: { identityId: discordIdentity?.IdentityDiscord?.identityId },
  });

  const botApi = DiscordApi.forBotUser();

  // Get the roles for the user in those servers
  // Only pulls roles that discord bot has access to (i.e. roles of servers that have bot installed)
  const userGuildMembers = await Promise.all(
    discordServers
      .filter((server) => server.hasCultsBot)
      .map(async (server) => {
        return botApi.getDiscordGuildMember({
          serverId: server.id,
          memberId: userDiscordData.discordUserId,
        });
      }),
  );

  // converting to Set to remove many duplicate "undefined" roleIds
  // note: roleIds returned by Discord don't include the @everyone role
  const roleIds = [...new Set(userGuildMembers.map((member) => member.roles).flat())].filter(
    (val) => !!val,
  );

  const serverIds = discordServers.map((server) => server.id);

  // Get groups where either
  // 1) a user has roleId associated with that group (Ize only knows roleIds if server has Ize bot)
  // 2) a user is part of that discord server, but the server doesn't have the Ize bot yet though
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { GroupDiscordRole: { discordRoleId: { in: roleIds } } },
        {
          GroupDiscordRole: {
            AND: {
              name: "@everyone",
              discordServer: { discordServerId: { in: serverIds } },
            },
          },
        },
      ],
    },
  });

  return groups.map((group) => group.id);
};
