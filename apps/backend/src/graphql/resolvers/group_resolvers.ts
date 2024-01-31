import { setUpDiscordServerService } from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "@/prisma/client";

import { groupInclude, formatGroup, GroupPrismaType } from "@utils/formatGroup";
import { getGroupsOfUser } from "@/services/groups/getGroupsOfUser";

import {
  Group,
  MutationNewCustomGroupArgs,
  MutationSetUpDiscordServerArgs,
  QueryGroupArgs,
} from "@graphql/generated/resolver-types";
import { newCustomGroup as newCustomGroupService } from "@/services/groups/newCustomGroup";

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
  context: GraphqlRequestContext,
): Promise<Group[]> => {
  return await getGroupsOfUser({ context });
};

export const newCustomGroup = async (
  root: unknown,
  args: MutationNewCustomGroupArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newCustomGroupService({ args, context });
};

export const groupMutations = {
  setUpDiscordServer,
  newCustomGroup,
};

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
