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

export const createPermissionFilter = ({
  groupIds,
  identityIds,
  userId,
}: {
  groupIds: string[];
  identityIds: string[];
  userId: string | undefined;
}): Prisma.PermissionWhereInput => ({
  OR: [
    { anyone: true },
    {
      EntitySet: createEntitySetFilter({ groupIds, identityIds, userId }),
    },
  ],
});

export const createEntitySetFilter = ({
  groupIds,
  identityIds,
  userId,
}: {
  groupIds: string[];
  identityIds: string[];
  userId: string | undefined;
}): Prisma.EntitySetWhereInput => ({
  EntitySetEntities: {
    some: {
      Entity: {
        OR: [
          { Group: { id: { in: groupIds } } },
          { Identity: { id: { in: identityIds } } },
          { User: { id: userId } },
        ],
      },
    },
  },
});
