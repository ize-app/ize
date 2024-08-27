import { useEffect, useState } from "react";
import { FieldPath, FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

import { EntitySearch, Select } from "../../formFields";
import { PermissionSchemaType, PermissionType } from "../formValidation/permission";

interface PermissionFormProps<T extends FieldValues> {
  branch: "request" | "response";
  fieldName: FieldPath<T>; // The path to the permission field in the form schema
}

// Helper function to create a default permission state
const createDefaultPermissionState = (type: PermissionType): PermissionSchemaType => {
  return {
    type,
    entities: [],
  };
};

export const PermissionForm = <T extends FieldValues>({
  branch,
  fieldName,
}: PermissionFormProps<T>) => {
  const formMethods = useFormContext<T>();

  // Construct the path to the permission type field
  const permissionTypePath = `${fieldName}.type` as Path<T>;
  const permissionType = formMethods.watch(permissionTypePath as Path<T>) as PermissionType;

  const [prevPermissionType, setPrevPermissionType] = useState<PermissionType | undefined>(
    permissionType,
  );

  useEffect(() => {
    if (prevPermissionType && permissionType && permissionType !== prevPermissionType) {
      const permissionPath = `${fieldName}` as FieldPath<T>;

      // Use PathValue to ensure type safety for the value being set
      const defaultPermissionState = createDefaultPermissionState(
        permissionType,
      ) as PermissionSchemaType as PathValue<T, typeof permissionPath>;

      formMethods.setValue(permissionPath, defaultPermissionState);
    }
    setPrevPermissionType(permissionType);
  }, [permissionType]);

  const isEntitiesRequestTrigger = permissionType === PermissionType.Entities;

  return (
    <>
      <Select
        control={formMethods.control}
        name={permissionTypePath}
        selectOptions={[
          { name: "Certain individuals and groups", value: PermissionType.Entities },
          {
            name: `Anyone can ${branch === "request" ? "trigger" : "respond"}`,
            value: PermissionType.Anyone,
          },
        ]}
        label={branch === "request" ? "Who can trigger this flow?" : "Who can respond"}
      />
      {isEntitiesRequestTrigger && (
        <EntitySearch
          key="requestRoleSearch"
          ariaLabel={`Individuals and groups who can ${
            branch === "request" ? "trigger this flow" : "respond"
          }`}
          name={`${fieldName}.entities` as Path<T>}
          control={formMethods.control}
          setFieldValue={formMethods.setValue}
          getFieldValues={formMethods.getValues}
        />
      )}
    </>
  );
};
