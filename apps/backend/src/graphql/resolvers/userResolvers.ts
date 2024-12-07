import { identityResolver } from "@/core/entity/identity/identityResolver";

import { userInclude } from "@/core/user/userPrismaTypes";
import { userResolver } from "@/core/user/userResolver";
import {
  GroupWatchFilter,
  Identity,
  Me,
  MutationResolvers,
  MutationUpdateProfileArgs,
  MutationWatchFlowArgs,
  MutationWatchGroupArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";
import { watchGroup as watchGroupService } from "@/core/user/watchGroup";
import { watchFlow as watchFlowService } from "@/core/user/watchFlow";

import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { updateProfile as updateProfileService } from "@/core/user/updateProfile";
import { GraphQLError } from "graphql";
import { CustomErrorCodes } from "../errors";
import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";

const me: QueryResolvers["me"] = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Me | null> => {
  if (!context.currentUser) return null;

  const identities: Identity[] = context.currentUser.Identities.map((identity) => {
    return identityResolver(
      identity,
      context.currentUser?.Identities.map((i) => i.id) ?? [],
      false,
    );
  });

  const groups = await getGroupsOfUser({
    context,
    args: { limit: 10, searchQuery: "", watchFilter: GroupWatchFilter.Watched, isMember: false },
  });

  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: context.currentUser.id },
  });
  const user = userResolver(userData);

  const settings = context.currentUser.UserSettings;

  return {
    user,
    groups: groups.map((group) => group.group),
    identities: [...identities],
    notifications: settings && {
      transactional: settings.transactional,
      marketing: settings.marketing,
    },
  };
};

export const updateProfile: MutationResolvers["updateProfile"] = async (
  root: unknown,
  args: MutationUpdateProfileArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  return await updateProfileService({ args, context });
};

export const watchGroup: MutationResolvers["watchGroup"] = async (
  root: unknown,
  args: MutationWatchGroupArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  return await watchGroupService({
    args,
    user: context.currentUser,
    entityId: context.currentUser.entityId,
  });
};

export const watchFlow: MutationResolvers["watchFlow"] = async (
  root: unknown,
  args: MutationWatchFlowArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  return await prisma.$transaction(async (transaction) => {
    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });
    return await watchFlowService({
      flowId: args.flowId,
      watch: args.watch,
      entityId: context.currentUser.entityId,
      transaction,
      user: context.currentUser,
    });
  });
};

export const userQueries = {
  me,
};

export const userMutations = {
  updateProfile,
  watchGroup,
  watchFlow,
};
