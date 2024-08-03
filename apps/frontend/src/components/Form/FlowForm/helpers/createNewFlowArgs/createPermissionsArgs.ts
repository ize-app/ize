import { createEntityArgs } from "@/components/Form/utils/createEntityArgs";
import { Entity, PermissionArgs } from "@/graphql/generated/graphql";

import { PermissionSchemaType, PermissionType } from "../../formValidation/permission";

export const createPermissionArgs = (
  permission: PermissionSchemaType | undefined,
): PermissionArgs => {
  return {
    anyone: permission && permission.type === PermissionType.Anyone ? true : false,
    entities: (permission?.entities ?? []).map((entity) => createEntityArgs(entity as Entity)),
  };
};
