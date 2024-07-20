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
  QueryResolvers,
} from "@graphql/generated/resolver-types";

import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { updateProfile as updateProfileService } from "@/core/user/updateProfile";
import { GraphQLError } from "graphql";
import { CustomErrorCodes } from "../errors";

const me: QueryResolvers["me"] = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Me | null> => {
  if (!context.currentUser) return null;

  const discordServers = await getDiscordServers({ context });
  await updateUserDiscordGroups({ context, discordServers });
  await updateUserNftGroups({ context });

  const identities: Identity[] = context.currentUser.Identities.map((identity) => {
    return identityResolver(
      identity,
      context.currentUser?.Identities.map((i) => i.id) ?? [],
      false,
    );
  });

  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: context.currentUser.id },
  });
  const user = userResolver(userData);

  return {
    user,
    discordServers,
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

export const userQueries = {
  me,
};

export const userMutations = {
  updateProfile,
};
