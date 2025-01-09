import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";

import { newIzeGroup as newCustomGroupService } from "@/core/entity/group/newGroup/newCustomGroup";
import { newEntities as newEntitiesService } from "@/core/entity/newEntities";
import { prisma } from "@/prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import {
  Entity,
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
import { getIzeGroup } from "@/core/entity/group/getIzeGroup";
import { logResolverError } from "../logResolverError";

const newEntities: MutationResolvers["newEntities"] = async (
  root: unknown,
  args: MutationNewEntitiesArgs,
  context: GraphqlRequestContext,
): Promise<Entity[]> => {
  try {
    return await newEntitiesService(args, context);
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "newEntities", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

const group: QueryResolvers["group"] = async (
  root: unknown,
  args: QueryGroupArgs,
  context: GraphqlRequestContext,
): Promise<IzeGroup> => {
  try {
    return await getIzeGroup({ groupId: args.id, context, getWatchAndPermissionStatus: true });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "group", operation: "query" },
        contexts: { args },
      },
    });
  }
};

export const groupsForCurrentUser: QueryResolvers["groupsForCurrentUser"] = async (
  root: unknown,
  args: QueryGroupsForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<IzeGroup[]> => {
  try {
    return await getGroupsOfUser({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "groupsForCurrentUser", operation: "query" },
        contexts: { args },
      },
    });
  }
};

export const newCustomGroup: MutationResolvers["newCustomGroup"] = async (
  root: unknown,
  args: MutationNewCustomGroupArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  try {
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

    return groupId;
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "newCustomGroup", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

export const entityMutations = {
  newCustomGroup,
  newEntities,
};

export const entityQueries = {
  group,
  groupsForCurrentUser,
};
