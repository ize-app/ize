import { identityResolver } from "@/core/entity/identity/identityResolver";
import { updateUserDiscordGroups } from "@/core/entity/updateIdentitiesGroups/updateUserDiscordGroups";
import { updateUserNftGroups } from "@/core/entity/updateIdentitiesGroups/updateUserNftGroups";
import { userInclude } from "@/core/user/userPrismaTypes";
import { userResolver } from "@/core/user/userResolver";
import { getDiscordServers } from "@/discord/getDiscordServers";
import { Identity, Me } from "@graphql/generated/resolver-types";

import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";

const me = async (
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

export const userQueries = {
  me,
};
