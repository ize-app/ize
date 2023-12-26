import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { Me, Identity } from "@graphql/generated/resolver-types";
import { getGroupIdsOfUserService } from "@services/groups/getGroupIdsOfUserService";
import { userInclude, formatUser } from "@utils/formatUser";

const users = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

const me = async (
  root: unknown,
  args: Record<string, never>,
  contextValue: GraphqlRequestContext,
): Promise<Me | null> => {
  if (!contextValue.currentUser) return null;

  const groupIds = await getGroupIdsOfUserService(contextValue);
  const identities: Identity[] = contextValue.currentUser.Identities.map((identity) => {
    if (identity.IdentityBlockchain)
      return {
        __typename: "IdentityBlockchain",
        id: identity.id,
        address: identity.IdentityBlockchain.address,
      };
    else if (identity.IdentityEmail) {
      return {
        __typename: "IdentityEmail",
        id: identity.id,
        email: identity.IdentityEmail.email,
        icon: identity.IdentityEmail.icon,
      };
    } else if (identity.IdentityDiscord) {
      return {
        __typename: "IdentityDiscord",
        id: identity.id,
        username: identity.IdentityDiscord.username,
        discordUserId: identity.IdentityDiscord.discordUserId,
        discriminator: identity.IdentityDiscord.discriminator,
        icon: identity.IdentityDiscord.avatar,
      };
    } else {
      throw Error("Unknown identity");
    }
  });
  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: contextValue.currentUser.id },
  });
  const user = formatUser(userData);

  return {
    user,
    groupIds,
    identities: [...identities],
  };
};

export const userQueries = {
  users,
  me,
};
