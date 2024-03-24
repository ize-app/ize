import { Prisma } from "@prisma/client";

export const identityInclude = Prisma.validator<Prisma.IdentityInclude>()({
  IdentityBlockchain: true,
  IdentityDiscord: true,
  IdentityEmail: true,
});

export type IdentityPrismaType = Prisma.IdentityGetPayload<{
  include: typeof identityInclude;
}>;
