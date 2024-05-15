import { Permission } from "@/graphql/generated/graphql";
import { PermissionSchemaType, PermissionType } from "../../formValidation/permission";
import { EntitySchemaType } from "../../../formValidation/entity";

export const createPermissionFormState = (permission: Permission): PermissionSchemaType => {
  if (permission.anyone) return { type: PermissionType.Anyone };
  else if (permission.stepTriggered) return { type: PermissionType.Process };
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
