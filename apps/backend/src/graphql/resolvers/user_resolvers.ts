import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { Me, Identity } from "@graphql/generated/resolver-types";
import { getGroupIdsOfUserService } from "@services/groups/getGroupIdsOfUserService";
import { userInclude, formatUser } from "@utils/formatUser";
import { formatIdentity } from "@/utils/formatIdentity";

const me = async (
  root: unknown,
  args: Record<string, never>,
  contextValue: GraphqlRequestContext,
): Promise<Me | null> => {
  if (!contextValue.currentUser) return null;

  const groupIds = await getGroupIdsOfUserService(contextValue);
  const identities: Identity[] = contextValue.currentUser.Identities.map((identity) => {
    return formatIdentity(identity, contextValue.currentUser);
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
  me,
};
