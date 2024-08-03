import { Permission } from "@/graphql/generated/resolver-types";

import { PermissionPrismaType } from "./permissionPrismaTypes";
import { entityResolver } from "../entity/entityResolver";

export const permissionResolver = (
  permission: PermissionPrismaType,
  userIdentityIds: string[],
): Permission => {
  if (!permission) return { stepTriggered: true, anyone: false, entities: [] };

  const entities = permission.EntitySet
    ? permission.EntitySet.EntitySetEntities.map((entity) => {
        return entityResolver({ entity: entity.Entity, userIdentityIds });
      })
    : [];

  return {
    stepTriggered: false,
    anyone: permission.anyone,
    entities,
  };
};
