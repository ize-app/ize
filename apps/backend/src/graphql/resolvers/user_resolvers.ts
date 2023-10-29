import { User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";

const users = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

const me = async (
  root: unknown,
  args: {},
  contextValue: GraphqlRequestContext,
): Promise<User> => {
  return contextValue.currentUser;
};

export const userQueries = {
  users,
  me,
};
