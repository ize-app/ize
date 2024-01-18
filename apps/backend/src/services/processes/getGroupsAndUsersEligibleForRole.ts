import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { discordServers } from "@/graphql/resolvers/discord_resolvers";
import { groupInclude, formatGroup } from "@utils/formatGroup";

import { Group, User } from "@graphql/generated/resolver-types";

export const getGroupsAndUsersEliglbeForRole = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<(User | Group)[]> => {
  if (!context.currentUser) throw Error("ERROR processesForCurrentUser: No user is authenticated");

  return await getDiscordGroupsEligibleForRole(root, args, context);
};

const getDiscordGroupsEligibleForRole = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<(User | Group)[]> => {
  if (!context.discordApi) return [];

  const servers = await discordServers(root, {}, context);
  const serverIds = await servers.map((server) => server.id);

  const groups = await prisma.group.findMany({
    where: {
      GroupDiscordRole: {
        discordServer: {
          discordServerId: { in: serverIds },
        },
      },
    },
    include: groupInclude,
  });
  const formattedGroups = groups.map((group) => formatGroup(group));

  return formattedGroups;
};
