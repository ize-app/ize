import { Prisma } from "@prisma/client";

export const userInclude = Prisma.validator<Prisma.UserInclude>()({});

export const meInclude = Prisma.validator<Prisma.UserInclude>()({
  Oauths: true,
  Identities: {
    include: {
      IdentityBlockchain: true,
      IdentityDiscord: true,
      IdentityEmail: true,
    },
  },
});

export type UserPrismaType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export type MePrismaType = Prisma.UserGetPayload<{
  include: typeof meInclude;
}>;
