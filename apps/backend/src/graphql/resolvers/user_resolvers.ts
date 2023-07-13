import { prisma } from "../../prisma/client";

const users = async () => {
  const users = await prisma.user.findMany();
  return users;
 }

export const userQueries = {
  users,
}
