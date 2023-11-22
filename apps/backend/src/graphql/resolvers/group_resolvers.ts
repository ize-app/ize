import { setUpDiscordServerService } from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "backend/src/graphql/context";
import { prisma } from "backend/src/prisma/client";
import { DiscordApi } from "@discord/api";

import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { groupsForCurrentUserService } from "@services/groups/groupsForCurrentUserService";

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

export const groupsForCurrentUser = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext,
) => {
  return groupsForCurrentUserService(context);
};

export const groupMutations = {
  setUpDiscordServer,
};

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
