import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { Me, Identity } from "@graphql/generated/resolver-types";
import { userInclude, formatUser } from "@utils/formatUser";
import { formatIdentity } from "@/utils/formatIdentity";
import { getDiscordServers } from "@/discord/getDiscordServers";
import { updateUserDiscordGroups } from "@/services/groups/updateIdentitiesGroups/updateUserDiscordGroups";
import { updateUserNftGroups } from "@/services/groups/updateIdentitiesGroups/updateUserNftGroups";

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
    return formatIdentity(identity, context.currentUser);
  });

  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: context.currentUser.id },
  });
  const user = formatUser(userData);

  return {
    user,
    discordServers,
    identities: [...identities],
  };
};

export const userQueries = {
  me,
};
