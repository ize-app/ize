import {
  setUpDiscordServerService,
} from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "../context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "@discord/api";

interface GQLGroup {
  id: string;
  name: string;
  icon?: string;
  banner?: string;
}

const setUpDiscordServer = async (
  root: unknown,
  args: {
    input: {
      serverId: string;
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
  return await prisma.group.findFirst({ where: { id: args.id } });
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
  const serverMap = new Map(userGuilds.map((guild) => [guild.id, guild]));
  const serverIds = userGuilds.map((guild) => guild.id);

  // Get the roles for the user in those servers
  const userGuildMembers = await Promise.all(
    userGuilds.map(async (guild) => {
      return botApi.getDiscordGuildMember({
        serverId: guild.id,
        memberId: userDiscordData.discordId,
      });
    })
  );

  const roleIds = userGuildMembers.map((member) => member.roles).flat();

  // Get groups that the user is in a server, role or has created.
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { discordRoleGroup: { discordRoleId: { in: roleIds } } },
        { creatorId: context.currentUser.id },
      ],
    },
    include: {
      creator: {
        include: {
          discordData: true,
        },
      },
      discordRoleGroup: {
        include: {
          discordServer: true,
        },
      },
    },
  });

  const roleGroups = groups.filter((group) => group.discordRoleGroup);
  const serversForRoleGroups = new Set(
    roleGroups.map(
      (group) => group.discordRoleGroup.discordServer.discordServerId
    )
  );

  const discordRoles = await Promise.all(
    [...serversForRoleGroups].map(async (serverId) => {
      const roles = await botApi.getDiscordServerRoles(serverId);
      return roles.filter((role) => roleIds.includes(role.id));
    })
  );

  const roleMap = new Map(
    discordRoles.flat().map((roles) => [roles.id, roles])
  );

  return groups.map((group) => {
    if (group.discordRoleGroup?.discordRoleId) {
      const roleData = roleMap.get(group.discordRoleGroup?.discordRoleId);
      if (roleData == null) {
        // TODO: Get the role data because this user created the role
      }

      return {
        ...group,
        type: GroupType.DiscordRole,
      };
    } else {
      return {
        ...group,
        type: GroupType.Standard,
      };
    }
  });
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
