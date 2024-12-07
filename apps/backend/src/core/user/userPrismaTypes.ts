import { Prisma } from "@prisma/client";

import { identityInclude } from "../entity/identity/identityPrismaTypes";

export const userInclude = Prisma.validator<Prisma.UserInclude>()({
  Identities: {
    include: identityInclude,
  },
});

export const meInclude = Prisma.validator<Prisma.UserInclude>()({
  Oauths: true,
  Identities: {
    include: identityInclude,
  },
  UserSettings: true
});

export type UserPrismaType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export type MePrismaType = Prisma.UserGetPayload<{
  include: typeof meInclude;
}>;
