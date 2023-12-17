import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";
import { Me } from "@graphql/generated/resolver-types";
import { getGroupIdsOfUserService } from "@services/groups/getGroupIdsOfUserService";
import { userInclude, formatUser } from "backend/src/utils/formatUser";

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
  const userData = await prisma.user.findFirstOrThrow({
    include: userInclude,
    where: { id: contextValue.currentUser.id },
  });
  const user = formatUser(userData);

  return {
    user,
    groupIds,
  };
};

export const userQueries = {
  users,
  me,
};
