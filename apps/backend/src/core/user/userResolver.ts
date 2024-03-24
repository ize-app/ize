import { User } from "@graphql/generated/resolver-types";
import { UserPrismaType } from "./userPrismaTypes";

export const userResolver = (user: UserPrismaType): User => {
  return {
    id: user.id,
    name: user.firstName ? user.firstName + " " + user.lastName : "User",
    createdAt: user.createdAt.toString(),
  };
};
