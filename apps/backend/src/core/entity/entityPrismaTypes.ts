import { Prisma } from "@prisma/client";

import { groupInclude } from "./group/groupPrismaTypes";
import { identityInclude } from "./identity/identityPrismaTypes";

export const entityInclude = Prisma.validator<Prisma.EntityInclude>()({
  Group: {
    include: groupInclude,
  },
  Identity: {
    include: identityInclude,
  },
});

export type EntityPrismaType = Prisma.EntityGetPayload<{
  include: typeof entityInclude;
}>;

export const entitySetInclude = Prisma.validator<Prisma.EntitySetInclude>()({
  EntitySetEntities: {
    include: {
      Entity: {
        include: entityInclude,
      },
    },
  },
});

export type EntitySetPrismaType = Prisma.EntitySetGetPayload<{
  include: typeof entitySetInclude;
}>;
