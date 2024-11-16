import { useEffect, useState } from "react";
import { FieldPath, FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

import { EntitySearch, Switch } from "../../formFields";
import { PermissionSchemaType } from "../formValidation/permission";

interface PermissionFormProps<T extends FieldValues> {
  branch: "request" | "response";
  fieldName: FieldPath<T>; // The path to the permission field in the form schema
}

// Helper function to create a default permission state
const createDefaultPermissionState = (anyone: boolean): PermissionSchemaType => {
  return {
    anyone,
    entities: [],
  };
};

export const PermissionForm = <T extends FieldValues>({
  branch,
  fieldName,
}: PermissionFormProps<T>) => {
  const formMethods = useFormContext<T>();

  // Construct the path to the permission type field
  const permissionTypePath = `${fieldName}.anyone` as Path<T>;
  const isAnyonePermission = formMethods.watch(permissionTypePath) as boolean;

  const [prevIsAnyonePermission, setPrevIsAnyonePermission] = useState<boolean>(isAnyonePermission);

  useEffect(() => {
    if (
      prevIsAnyonePermission &&
      isAnyonePermission &&
      isAnyonePermission !== prevIsAnyonePermission
    ) {
      const permissionPath = `${fieldName}` as FieldPath<T>;

      // Use PathValue to ensure type safety for the value being set
      const defaultPermissionState = createDefaultPermissionState(isAnyonePermission) as PathValue<
        T,
        typeof permissionPath
      >;

      formMethods.setValue(permissionPath, defaultPermissionState);
    }
    setPrevIsAnyonePermission(isAnyonePermission);
  }, [isAnyonePermission]);

  return (
    <>
      <Switch name={permissionTypePath} label="Anyone can respond" />
      {!isAnyonePermission && (
        <EntitySearch
          key="requestRoleSearch"
          ariaLabel={`Individuals and groups who can ${
            branch === "request" ? "trigger this flow" : "respond"
          }`}
          name={`${fieldName}.entities` as Path<T>}
        />
      )}
    </>
  );
};
