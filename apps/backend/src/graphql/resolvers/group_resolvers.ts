import { setUpDiscordServerService } from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "@/prisma/client";
import { newAgents as newAgentsService } from "@/services/groups/newAgents";
import { groupInclude, formatGroup, GroupPrismaType } from "@utils/formatGroup";
import { getGroupsOfUser } from "@/services/groups/getGroupsOfUser";

import {
  Agent,
  Group,
  MutationNewAgentsArgs,
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
