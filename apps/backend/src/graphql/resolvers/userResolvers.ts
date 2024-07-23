import { identityResolver } from "@/core/entity/identity/identityResolver";
import { updateUserDiscordGroups } from "@/core/entity/updateIdentitiesGroups/updateUserDiscordGroups";
import { updateUserNftGroups } from "@/core/entity/updateIdentitiesGroups/updateUserNftGroups";
import { userInclude } from "@/core/user/userPrismaTypes";
import { userResolver } from "@/core/user/userResolver";
import { getDiscordServers } from "@/discord/getDiscordServers";
import {
  Identity,
  Me,
  MutationResolvers,
  MutationUpdateProfileArgs,
  MutationWatchGroupArgs,
  QueryResolvers,
  WatchGroupFilter,
} from "@graphql/generated/resolver-types";
import { watchGroup as watchGroupService } from "@/core/user/watchGroup";

import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { updateProfile as updateProfileService } from "@/core/user/updateProfile";
import { GraphQLError } from "graphql";
import { CustomErrorCodes } from "../errors";
import { updateUserCustomGroups } from "@/core/entity/updateIdentitiesGroups/updateUserCustomGroups";
import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";

const me: QueryResolvers["me"] = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Me | null> => {
  if (!context.currentUser) return null;

  const discordServers = await getDiscordServers({ context });
  await updateUserDiscordGroups({ context, discordServers });
  await updateUserNftGroups({ context });
  await updateUserCustomGroups({ context });

  const identities: Identity[] = context.currentUser.Identities.map((identity) => {
    return identityResolver(
      identity,
      context.currentUser?.Identities.map((i) => i.id) ?? [],
      false,
    );
  });

  const groups = await getGroupsOfUser({
    context,
    args: { limit: 10, searchQuery: "", watchFilter: WatchGroupFilter.Watched },
  });

  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: context.currentUser.id },
  });
  const user = userResolver(userData);

  return {
    user,
    discordServers,
    groups,
    identities: [...identities],
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
  return await watchGroupService({ args, context });
};

export const userQueries = {
  me,
};

export const userMutations = {
  updateProfile,
  watchGroup,
};
