import { setUpDiscordServerService } from "@/core/entity/group/discord_server_group";
import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "@/prisma/client";
import { newAgents as newAgentsService } from "@/core/entity/group/newAgents";
import { groupInclude, formatGroup, GroupPrismaType } from "@/core/entity/group/formatGroup";
import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";

import {
  Agent,
  Group,
  MutationNewAgentsArgs,
  MutationNewCustomGroupArgs,
  MutationSetUpDiscordServerArgs,
  QueryGroupArgs,
} from "@graphql/generated/resolver-types";
import { newCustomGroup as newCustomGroupService } from "@/core/entity/group/newCustomGroup";

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

const newAgents = async (
  root: unknown,
  args: MutationNewAgentsArgs,
  context: GraphqlRequestContext,
): Promise<Agent[]> => {
  return await newAgentsService(args, context);
};

export const groupMutations = {
  setUpDiscordServer,
  newCustomGroup,
  newAgents,
};

export const groupQueries = {
  group,
  groupsForCurrentUser,
};
