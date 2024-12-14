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
import { updateEntityWatchFlows as watchFlowService } from "@/core/entity/updateEntityWatchFlow";

import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { updateProfile as updateProfileService } from "@/core/user/updateProfile";
import { GraphQLError } from "graphql";
import { CustomErrorCodes } from "../errors";
import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";
import { FlowType } from "@prisma/client";
import { getGroupIdsOfUser } from "@/core/entity/group/getGroupIdsOfUser";

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
      true,
    );
  });

  const groups = await getGroupsOfUser({
    context,
    args: { limit: 10, searchQuery: "", watchFilter: GroupWatchFilter.Watched, isMember: false },
  });
  const groupIds = await getGroupIdsOfUser({ context });

  // get groups that user is watching, can make watch requets for, and the group isn't already watching that flow
  const groupInvitations = await prisma.groupIze.findFirst({
    where: {
      group: {
        AND: [
          { id: { in: groupIds } },
          {
            EntityWatchedGroups: {
              none: {
                entityId: { in: context.userEntityIds },
              },
            },
          },
        ],
      },
    },
  });

  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: context.currentUser.id },
  });

  const watchedGroup = await prisma.entityWatchedGroups.findFirst({
    where: {
      entityId: { in: context.userEntityIds },
    },
  });

  const createdFlow = await prisma.flow.findFirst({
    where: {
      creatorEntityId: { in: context.userEntityIds },
      type: FlowType.Custom,
    },
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
    hasGroupInvites: !!groupInvitations,
    hasCreatedFlow: !!createdFlow,
    hasWatchedGroup: !!watchedGroup,
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
    await watchFlowService({
      flowIds: [args.flowId],
      watch: args.watch,
      entityId: context.currentUser.entityId,
      transaction,
    });
    return true;
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
