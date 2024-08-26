import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { EntitySearch, Select } from "../../formFields";
import { FlowSchemaType } from "../formValidation/flow";
import { PermissionSchemaType, PermissionType } from "../formValidation/permission";

interface PermissionFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  branch: "request" | "response";
}

const createDefaultPermissionState = (type: PermissionType): PermissionSchemaType => {
  return {
    type,
    entities: [],
  };
};

export const PermissionForm = ({ formMethods, formIndex, branch }: PermissionFormProps) => {
  const permissionType = formMethods.watch(`steps.${formIndex}.${branch}.permission.type`);
  const [prevPermissionType, setPrevPermissionType] = useState<PermissionType | undefined>(
    permissionType,
  );
  useEffect(() => {
    if (prevPermissionType && permissionType && permissionType !== prevPermissionType) {
      formMethods.setValue(
        `steps.${formIndex}.${branch}.permission`,
        createDefaultPermissionState(permissionType),
      );
    }
    setPrevPermissionType(permissionType);
  }, [permissionType]);

  const isEntitiesRequestTrigger =
    formMethods.watch(`steps.${formIndex}.${branch}.permission.type`) === PermissionType.Entities;

  return (
    <>
      <Select
        control={formMethods.control}
        name={`steps.${formIndex}.${branch}.permission.type`}
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
          ariaLabel={`Individuals and groups who can ${branch === "request" ? "trigger this flow" : "respond"}`}
          name={`steps.${formIndex}.${branch}.permission.entities`}
          control={formMethods.control}
          setFieldValue={formMethods.setValue}
          getFieldValues={formMethods.getValues}
        />
      )}{" "}
    </>
  );
};
