import { PermissionArgs } from "@/graphql/generated/graphql";

import { PermissionSchemaType, PermissionType } from "../../formValidation/permission";

export const createPermissionArgs = (
  permission: PermissionSchemaType | undefined,
  userId?: string,
): PermissionArgs => {
  return {
    anyone: permission && permission.type === PermissionType.Anyone ? true : false,
    entities: (permission?.entities ?? []).map((entity) => ({ id: entity.entityId })),
    userId,
  };
};
