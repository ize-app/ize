import { Prisma } from "@prisma/client";
import { User } from "@graphql/generated/resolver-types";

export const userInclude = Prisma.validator<Prisma.UserInclude>()({
  Identities: {
    include: { IdentityBlockchain: true, IdentityDiscord: true, IdentityEmail: true },
  },
});

export const meInclude = Prisma.validator<Prisma.UserInclude>()({
  Oauths: true,
  Identities: {
    include: { IdentityBlockchain: true, IdentityDiscord: true, IdentityEmail: true },
  },
});

export type UserPrismaType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export type MePrismaType = Prisma.UserGetPayload<{
  include: typeof meInclude;
}>;

export const formatUser = (user: UserPrismaType): User => {
  return {
    id: user.id,
    name: user.firstName ? user.firstName + " " + user.lastName : "User",
    createdAt: user.createdAt.toString(),
  };
};
