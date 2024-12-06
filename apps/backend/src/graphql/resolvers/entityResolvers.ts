import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";

import { newIzeGroup as newCustomGroupService } from "@/core/entity/group/newGroup/newCustomGroup";
import { newEntities as newEntitiesService } from "@/core/entity/newEntities";
import { prisma } from "@/prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import {
  Entity,
  Group,
  IzeGroup,
  MutationNewCustomGroupArgs,
  MutationNewEntitiesArgs,
  MutationResolvers,
  QueryGroupArgs,
  QueryGroupsForCurrentUserArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";
import { GraphQLError } from "graphql";
import { CustomErrorCodes } from "../errors";
import { updateUserGroups } from "@/core/entity/updateIdentitiesGroups/updateUserGroups/updateUserGroups";
import { getIzeGroup } from "@/core/entity/group/getIzeGroup";

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
  context: GraphqlRequestContext,
): Promise<IzeGroup> => {
  return await getIzeGroup({ groupId: args.id, context, getWatchAndPermissionStatus: true });
};

export const groupsForCurrentUser: QueryResolvers["groupsForCurrentUser"] = async (
  root: unknown,
  args: QueryGroupsForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Group[]> => {
  return await getGroupsOfUser({ args, context });
};

export const newCustomGroup: MutationResolvers["newCustomGroup"] = async (
  root: unknown,
  args: MutationNewCustomGroupArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  const groupId = await prisma.$transaction(async (transaction) => {
    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    const groupId = await newCustomGroupService({ args, context, transaction });

    // Watch group for user
    await transaction.entityWatchedGroups.create({
      data: {
        entityId: context.currentUser.entityId,
        groupId,
        watched: true,
      },
    });
    return groupId;
  });
  // associate user with any new identities that were created when creating the new group
  await updateUserGroups({ context });

  return groupId;
};

export const entityMutations = {
  newCustomGroup,
  newEntities,
};

export const entityQueries = {
  group,
  groupsForCurrentUser,
};
