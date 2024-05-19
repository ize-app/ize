import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "@/prisma/client";
import { newEntities as newEntitiesService } from "@/core/entity/newEntities";
import { groupResolver } from "@/core/entity/group/groupResolver";
import { groupInclude, GroupPrismaType } from "@/core/entity/group/groupPrismaTypes";
import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";

import {
  Entity,
  Group,
  MutationNewEntitiesArgs,
  MutationNewCustomGroupArgs,
  QueryGroupArgs,
  QueryResolvers,
  MutationResolvers,
} from "@graphql/generated/resolver-types";
import { newCustomGroup as newCustomGroupService } from "@/core/entity/group/newGroup/newCustomGroup";

const newEntities: MutationResolvers["newEntities"] = async (
  root: unknown,
  args: MutationNewEntitiesArgs,
  context: GraphqlRequestContext,
): Promise<Entity[]> => {
  return await newEntitiesService(args, context);
};

const group: QueryResolvers["group"] = async (
  root: unknown,
  args: QueryGroupArgs,
): Promise<Group> => {
  const group: GroupPrismaType = await prisma.group.findFirstOrThrow({
    include: groupInclude,
    where: { id: args.id },
  });

  return groupResolver(group);
};

export const groupsForCurrentUser: QueryResolvers["groupsForCurrentUser"] = async (
  root: unknown,
  context: GraphqlRequestContext,
): Promise<Group[]> => {
  return await getGroupsOfUser({ context });
};

export const newCustomGroup: MutationResolvers["newCustomGroup"] = async (
  root: unknown,
  args: MutationNewCustomGroupArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newCustomGroupService({ args, context });
};

export const entityMutations = {
  newCustomGroup,
  newEntities,
};

export const entityQueries = {
  group,
  groupsForCurrentUser,
};
