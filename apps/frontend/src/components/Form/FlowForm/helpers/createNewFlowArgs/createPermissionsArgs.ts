import { createEntityArgs } from "@/components/Form/utils/createEntityArgs";
import { Entity, PermissionArgs } from "@/graphql/generated/graphql";

import { PermissionSchemaType } from "../../formValidation/permission";

export const createPermissionArgs = (
  permission: PermissionSchemaType | undefined,
): PermissionArgs => {
  return {
    anyone: permission?.anyone ?? true,
    entities: (permission?.entities ?? []).map((entity) => createEntityArgs(entity as Entity)),
  };
};
