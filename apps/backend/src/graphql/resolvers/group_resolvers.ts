import { setUpDiscordServerService } from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "backend/src/graphql/context";
import { prisma } from "backend/src/prisma/client";

import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { groupsForCurrentUserService } from "@services/groups/groupsForCurrentUserService";

import {
  Group,
  MutationSetUpDiscordServerArgs,
  QueryGroupArgs,
} from "@graphql/generated/resolver-types";

const setUpDiscordServer = async (
  root: unknown,
  args: MutationSetUpDiscordServerArgs,
  context: GraphqlRequestContext,
) => {
  return await setUpDiscordServerService(args.input, context);
};

const group = async (root: unknown, args: QueryGroupArgs): Promise<Group> => {
  const group = await prisma.group.findFirst({
    include: groupInclude,
    where: { id: args.id },
  });

  return formatGroup(group);
};

export const groupsForCurrentUser = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Group[]> => {
  return groupsForCurrentUserService(context);
};

export const groupMutations = {
  setUpDiscordServer,
};

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
