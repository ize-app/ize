import { groupInclude } from "@/utils/formatGroup";
import { identityInclude } from "@/utils/formatIdentity";
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
