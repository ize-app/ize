import { PermissionFragment } from "@/graphql/generated/graphql";

import { EntitySchemaType } from "../../../formValidation/entity";
import { PermissionSchemaType, PermissionType } from "../../formValidation/permission";

export const createPermissionFormState = (permission: PermissionFragment): PermissionSchemaType => {
  if (permission.anyone) return { type: PermissionType.Anyone };
  else
    return {
      type: PermissionType.Entities,
      entities: permission.entities.map((entity) => {
        return entity;
      }) as EntitySchemaType[],
    };
};
