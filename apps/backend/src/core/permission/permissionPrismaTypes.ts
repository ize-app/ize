import { Prisma } from "@prisma/client";

import { entitySetInclude } from "../entity/entityPrismaTypes";

export const permissionInclude = Prisma.validator<Prisma.PermissionInclude>()({
  EntitySet: {
    include: entitySetInclude,
  },
});

export type PermissionPrismaType = Prisma.PermissionGetPayload<{
  include: typeof permissionInclude;
}>;
