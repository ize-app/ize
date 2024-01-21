// import { RoleType } from "@prisma/client";
import { RoleType } from "@/graphql/generated/resolver-types";
import { roleSetInclude, RoleSetPrismaType } from "@/utils/formatProcess";
import { GraphqlRequestContext } from "@graphql/context";
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "@/discord/api";

const processVersionRolesInclude = Prisma.validator<Prisma.ProcessVersionInclude>()({
  roleSet: {
    include: roleSetInclude,
  },
});

// checks whether one of a user's identities/groups has permissions
// to make a request or response
const hasRolePermission = async ({
  roleType,
  context,
  processVersionId,
  transaction = prisma,
}: {
  roleType: RoleType;
  context: GraphqlRequestContext;
  processVersionId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const processVersion = await transaction.processVersion.findFirstOrThrow({
    include: processVersionRolesInclude,
    where: {
      id: processVersionId,
    },
  });

  if (await hasIdentityPermission({ roleType, context, roleSet: processVersion.roleSet }))
    return true;

  if (await hasDiscordRoleGroupPermission({ roleType, context, roleSet: processVersion.roleSet }))
    return true;

  return false;
};

export default hasRolePermission;

// checks whether one of a user's identities are assigned a role
// for a given set of request or respond roles.
const hasIdentityPermission = async ({
  roleType,
  roleSet,
  context,
}: {
  roleType: RoleType;
  roleSet: RoleSetPrismaType;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const identityIds = context.currentUser.Identities.map((identity) => identity.id);

  const hasIdentityPermission = roleSet.RoleIdentities.some(
    (id) => identityIds.includes(id.identityId) && id.type === roleType,
  );

  return hasIdentityPermission;
};

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
const hasDiscordRoleGroupPermission = async ({
  roleType,
  roleSet,
  context,
}: {
  roleType: RoleType;
  roleSet: RoleSetPrismaType;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  if (!context.discordApi) throw Error("No Discord authentication data for user");

  const botApi = DiscordApi.forBotUser();

  // pull out role groups for discord
  const discordRoleGroups = roleSet.RoleGroups.filter(
    (roleGroup) => !!roleGroup.Group.GroupDiscordRole && roleGroup.type === roleType,
  ).map((roleGroup) => roleGroup.Group.GroupDiscordRole);

  // for now, there is only one discord account per user
  const userDiscordIdentity = context.currentUser.Identities.find((id) => !!id.IdentityDiscord);
  if (!userDiscordIdentity?.IdentityDiscord?.discordUserId)
    throw Error("No authenticated Discord user");

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
