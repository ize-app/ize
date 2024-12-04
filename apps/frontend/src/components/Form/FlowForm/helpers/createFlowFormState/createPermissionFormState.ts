import { PermissionFragment } from "@/graphql/generated/graphql";

import { EntitySchemaType } from "../../../formValidation/entity";
import { PermissionSchemaType } from "../../formValidation/permission";

export const createPermissionFormState = (permission: PermissionFragment): PermissionSchemaType => {
  if (permission.anyone) return { anyone: true, entities: [] };
  else
    return {
      anyone: permission.anyone,
      entities: permission.entities.map((entity) => {
        return entity;
      }) as EntitySchemaType[],
    };
};
