import { Prisma } from "@prisma/client";

import { permissionInclude } from "../permission/permissionPrismaTypes";

export const responseConfigInclude = Prisma.validator<Prisma.ResponseConfigInclude>()({
  ResponsePermissions: {
    include: permissionInclude,
  },
});

export type ResponseConfigPrismaType = Prisma.ResponseConfigGetPayload<{
  include: typeof responseConfigInclude;
}>;
