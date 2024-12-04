import { Permission } from "@/graphql/generated/resolver-types";

import { PermissionPrismaType } from "./permissionPrismaTypes";
import { entityResolver } from "../entity/entityResolver";

export const permissionResolver = (
  permission: PermissionPrismaType | null,
  userIdentityIds: string[],
): Permission => {
  if (!permission) return { anyone: false, entities: [] };

  const entities = permission.EntitySet
    ? permission.EntitySet.EntitySetEntities.map((entity) => {
        return entityResolver({ entity: entity.Entity, userIdentityIds });
      })
    : [];

  return {
    anyone: permission.anyone,
    entities,
  };
};
