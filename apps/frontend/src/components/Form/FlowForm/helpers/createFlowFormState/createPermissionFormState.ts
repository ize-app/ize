import { PermissionFragment } from "@/graphql/generated/graphql";

import { EntitySchemaType } from "../../../formValidation/entity";
import { PermissionSchemaType, PermissionType } from "../../formValidation/permission";

export const createPermissionFormState = (permission: PermissionFragment): PermissionSchemaType => {
  if (permission.anyone) return { type: PermissionType.Anyone };
  else
    return {
      type: PermissionType.Entities,
      entities: permission.entities.map((entity) => {
        if (entity.__typename === "Group")
          return { ...entity, groupType: { __typename: entity.groupType.__typename } };
        else if (entity.__typename === "Identity")
          return { ...entity, identityType: { __typename: entity.identityType.__typename } };
      }) as EntitySchemaType[],
    };
};
