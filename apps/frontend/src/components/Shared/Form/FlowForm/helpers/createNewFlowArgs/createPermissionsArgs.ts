import { PermissionArgs } from "@/graphql/generated/graphql";
import { PermissionSchemaType } from "../../formValidation/permission";
import { PermissionType } from "../../formValidation/permission";

export const createPermissionArgs = (permission: PermissionSchemaType): PermissionArgs => {
  return {
    anyone: permission.type === PermissionType.Anyone,
    entities: permission.entities?.map((entity) => ({ id: entity.entityId })),
  };
};
