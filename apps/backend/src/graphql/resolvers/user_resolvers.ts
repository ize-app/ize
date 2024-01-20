import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { Me, Identity } from "@graphql/generated/resolver-types";
// import { getGroupIdsOfUserService } from "@services/groups/getGroupIdsOfUserService";
import { userInclude, formatUser } from "@utils/formatUser";
import { formatIdentity } from "@/utils/formatIdentity";
import { getDiscordServers } from "@/services/discord/getDiscordServers";

const me = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Me | null> => {
  if (!context.currentUser) return null;

  const discordServers = await getDiscordServers({ context });

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
    groupIds: [],
    discordServers,
    identities: [...identities],
  };
};

export const userQueries = {
  me,
};
