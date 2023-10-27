import {
  setUpDiscordServerService,
} from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "../context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "@discord/api";
import { Prisma } from "@prisma/client";

const groupInclude = Prisma.validator<Prisma.GroupInclude>()({
  creator: {
    include: {
      discordData: true
    }
  },
  discordRoleGroup: {
    include: {
      discordServer: true
    }
  }
});

type GroupPrismaType = Prisma.GroupGetPayload<{
  include: typeof groupInclude;
}>;


const formatGroupData = (group: GroupPrismaType) => ({...group, 
  // discord only includes the @sign for @everyone
  name: group.discordRoleGroup.name !== "@everyone" ? "@"+ group.discordRoleGroup.name : group.discordRoleGroup.name, 
  type: GroupType.DiscordRole,
  icon: group.discordRoleGroup.icon ? 
    DiscordApi.createRoleIconURL(group.discordRoleGroup.discordRoleId, group.discordRoleGroup.icon) 
    : group.discordRoleGroup.name === "@everyone" ? DiscordApi.createServerIconURL(group.discordRoleGroup.discordServer.discordServerId,group.discordRoleGroup.discordServer.icon) : null,
  color: DiscordApi.colorIntToHex(group.discordRoleGroup.color),
  memberCount: group.discordRoleGroup.memberCount,
  organization: {name: group.discordRoleGroup.discordServer.name, icon: DiscordApi.createServerIconURL(group.discordRoleGroup.discordServer.discordServerId,group.discordRoleGroup.discordServer.icon)}
})


const setUpDiscordServer = async (
  root: unknown,
  args: {
    input: {
      serverId: string;
      roleId?: string;
    };
  },
  context: GraphqlRequestContext
) => {
  return await setUpDiscordServerService(args.input, context);
};

const group = async (
  root: unknown,
  args: {
    id: string;
  }
) => {
  const group = await prisma.group.findFirst({ 
    include: groupInclude,
    where: { id: args.id } });

  return formatGroupData(group);

};

const groupsForCurrentUser = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext
) => {
  const userDiscordData = await prisma.discordData.findFirstOrThrow({
    where: { userId: context.currentUser.id },
  });
  const botApi = DiscordApi.forBotUser();

  // Get the servers for the user using the users' API token
  const userGuilds = await context.discordApi.getDiscordServers();

  // const serverMap = new Map(userGuilds.map((guild) => [guild.id, guild]));
  // const serverIds = userGuilds.map((guild) => guild.id);

  // Get the roles for the user in those servers
  // Only pulls roles that discord bot has access to (i.e. roles of servers that have bot installed)
  const userGuildMembers = await Promise.all(
    userGuilds.map(async (guild) => {
      return botApi.getDiscordGuildMember({
        serverId: guild.id,
        memberId: userDiscordData.discordId,
      });
    })
  );

  // converting to Set to remove many duplicate "undefined" roleIds
  const roleIds = [...new Set(userGuildMembers.map((member) => member.roles).flat())];

  // Get groups that the user is in a server, role or has created.
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { discordRoleGroup: { discordRoleId: { in: roleIds } } },
        // @everyone isn't part of roleIds returned from discord API
        { discordRoleGroup: { name: "@everyone" }},
        { creatorId: context.currentUser.id },
      ],
    },
    include: groupInclude,
  });

  const formattedGroups = groups.map((group) => formatGroupData(group))
  return formattedGroups
};

export const groupMutations = {
  setUpDiscordServer,
};

export enum GroupType {
  Standard = "Standard",
  DiscordRole = "DiscordRole",
}

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
