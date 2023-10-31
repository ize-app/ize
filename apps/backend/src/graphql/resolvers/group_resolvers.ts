import { setUpDiscordServerService } from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "backend/src/graphql/context";
import { prisma } from "backend/src/prisma/client";
import { DiscordApi } from "@discord/api";

import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";

const setUpDiscordServer = async (
  root: unknown,
  args: {
    input: {
      serverId: string;
      roleId?: string;
    };
  },
  context: GraphqlRequestContext,
) => {
  return await setUpDiscordServerService(args.input, context);
};

const group = async (
  root: unknown,
  args: {
    id: string;
  },
) => {
  const group = await prisma.group.findFirst({
    include: groupInclude,
    where: { id: args.id },
  });

  return formatGroup(group);
};

const groupsForCurrentUser = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext,
) => {
  const userDiscordData = await prisma.discordData.findFirstOrThrow({
    where: { userId: context.currentUser.id },
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
        memberId: userDiscordData.discordId,
      });
    }),
  );

  // converting to Set to remove many duplicate "undefined" roleIds
  const roleIds = [
    ...new Set(userGuildMembers.map((member) => member.roles).flat()),
  ];

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
    include: groupInclude,
  });

  const formattedGroups = groups.map((group) => formatGroup(group));
  return formattedGroups;
};

export const groupMutations = {
  setUpDiscordServer,
};

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
