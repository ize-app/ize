import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../../formValidation/flow";
import { PermissionType } from "../../formValidation/permission";
import { RoleSearch, Select } from "../../../FormFields";
import { ResponsiveFormRow } from "../ResponsiveFormRow";

interface ResponsePermissionsForm {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const ResponsePermissionsForm = ({ formMethods, formIndex }: ResponsePermissionsForm) => {
  const isEntitiesRespondTrigger =
    formMethods.watch(`steps.${formIndex}.response.permission.type`) === PermissionType.Entities;

  return (
    <ResponsiveFormRow>
      <Select<FlowSchemaType>
        control={formMethods.control}
        width="300px"
        name={`steps.${formIndex}.response.permission.type`}
        selectOptions={[
          { name: "Certain people can respond", value: PermissionType.Entities },
          { name: "Anyone can respond", value: PermissionType.Anyone },
        ]}
        label="Who can respond?"
        displayLabel={false}
        size="small"
      />

      {isEntitiesRespondTrigger && (
        <RoleSearch<FlowSchemaType>
          key="responseRoleSearch"
          ariaLabel={"Individuals and groups who can respond"}
          name={`steps.${formIndex}.response.permission.entities`}
          control={formMethods.control}
          setFieldValue={formMethods.setValue}
          getFieldValues={formMethods.getValues}
        />
      )}
    </ResponsiveFormRow>
  );
};
