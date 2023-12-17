import { setUpDiscordServerService } from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "backend/src/graphql/context";
import { prisma } from "backend/src/prisma/client";

import { groupInclude, formatGroup, GroupPrismaType } from "backend/src/utils/formatGroup";
import { getGroupsOfUserService } from "@services/groups/getGroupsOfUserService";

import {
  Group,
  MutationSetUpDiscordServerArgs,
  QueryGroupArgs,
  QueryGroupsForCurrentUserArgs,
} from "@graphql/generated/resolver-types";

const setUpDiscordServer = async (
  root: unknown,
  args: MutationSetUpDiscordServerArgs,
  context: GraphqlRequestContext,
) => {
  return await setUpDiscordServerService(args, context);
};

const group = async (root: unknown, args: QueryGroupArgs): Promise<Group> => {
  const group: GroupPrismaType = await prisma.group.findFirstOrThrow({
    include: groupInclude,
    where: { id: args.id },
  });

  return formatGroup(group);
};

export const groupsForCurrentUser = async (
  root: unknown,
  args: QueryGroupsForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Group[]> => {
  return getGroupsOfUserService(args);
};

export const groupMutations = {
  setUpDiscordServer,
};

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
