import { groupInclude } from "../entity/group/groupPrismaTypes";
import { identityInclude } from "../entity/identity/identityPrismaTypes";
import { Prisma } from "@prisma/client";

export const permissionInclude = Prisma.validator<Prisma.PermissionInclude>()({
  EntitySet: {
    include: {
      EntitySetEntities: {
        include: {
          Entity: {
            include: {
              Group: {
                include: groupInclude,
              },
              Identity: {
                include: identityInclude,
              },
            },
          },
        },
      },
    },
  },
});

export type PermissionPrismaType = Prisma.PermissionGetPayload<{
  include: typeof permissionInclude;
}>;
