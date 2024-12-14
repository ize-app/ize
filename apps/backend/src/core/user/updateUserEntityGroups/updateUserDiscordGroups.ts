import { GroupType, Prisma } from "@prisma/client";

import { DiscordApi } from "@/discord/api";
import { getDiscordServers } from "@/discord/getDiscordServers";
import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";

import { upsertForGroupTypeOfEntity } from "./upsertForGroupTypeOfEntity";

export const updateUserDiscordGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<void> => {
  // try / catch so that me object will still return
  try {
    if (!context.currentUser) throw Error("ERROR Unauthenticated user");
    if (!context.discordApi) return;

    // if this call fails, existing entity_groups mapping for Discord won't be updated
    const discordServers = await getDiscordServers({ context });

    const userDiscordIdentity = context.currentUser.Identities.find((id) => !!id.IdentityDiscord);
    if (!userDiscordIdentity?.IdentityDiscord?.discordUserId)
      throw Error("No authenticated Discord user");

    const discordRoleGroupIds: string[] = [];

    const botApi = DiscordApi.forBotUser();

    // get unique list of server ids (Discord's internal ID)
    const serverDiscordIds = discordServers.map((server) => server.id);

    // get all discord role groups for servers that are in Ize
    const userServersRoleGroups = await transaction.group.findMany({
      include: {
        GroupDiscordRole: true,
      },
      where: {
        GroupDiscordRole: {
          discordServer: {
            discordServerId: { in: serverDiscordIds },
          },
        },
      },
    });

    // get finds ize role role groups for all roles that the user holds in servers that have the ize bot
    await Promise.all(
      discordServers.map(async (server) => {
        if (!server.hasCultsBot) return;
        const serverRoles = await botApi.getDiscordServerRoles(server.id);
        serverRoles.forEach((role) => {
          const roleGroup = userServersRoleGroups.find(
            (roleGroup) => roleGroup.GroupDiscordRole?.discordRoleId === role.id,
          );
          if (roleGroup) {
            discordRoleGroupIds.push(roleGroup.id);
          }
        });
      }),
    );

    // finds all @everyone roles in all servers that are on Ize
    userServersRoleGroups
      .filter((roleGroup) => roleGroup.GroupDiscordRole?.name === "@everyone")
      .forEach((roleGroup) => discordRoleGroupIds.push(roleGroup.id));

    await upsertForGroupTypeOfEntity({
      entityId: userDiscordIdentity.entityId,
      groupIds: discordRoleGroupIds,
      groupType: GroupType.DiscordRoleGroup,
      transaction,
    });
    return;
  } catch (e) {
    console.log("Error updateUserDiscordGroups", e);
    return;
  }
};
