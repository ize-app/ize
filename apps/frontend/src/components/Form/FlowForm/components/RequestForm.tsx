import { UseFormReturn } from "react-hook-form";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { RoleSearch, Select } from "../../formFields";
import { PermissionType } from "../formValidation/permission";
import { FlowSchemaType } from "../formValidation/flow";
import { FieldsForm } from "./FieldsForm";
import { Box } from "@mui/material";

interface RequestFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const RequestForm = ({ formMethods, formIndex, show }: RequestFormProps) => {
  const isEntitiesRequestTrigger =
    formMethods.watch(`steps.${formIndex}.request.permission.type`) === PermissionType.Entities;

  return (
    formIndex === 0 && (
      <Box sx={{ display: show ? "block" : "none" }}>
        <ResponsiveFormRow>
          <Select
            control={formMethods.control}
            width="300px"
            name={`steps.${formIndex}.request.permission.type`}
            selectOptions={[
              { name: "Certain individuals and groups", value: PermissionType.Entities },
              { name: "Anyone can request", value: PermissionType.Anyone },
            ]}
            label="Who can make requests?"
          />
          {isEntitiesRequestTrigger && (
            <RoleSearch
              key="requestRoleSearch"
              ariaLabel={"Individuals and groups who can make requests"}
              name={`steps.${formIndex}.request.permission.entities`}
              control={formMethods.control}
              setFieldValue={formMethods.setValue}
              getFieldValues={formMethods.getValues}
            />
          )}
        </ResponsiveFormRow>
        <FieldsForm formIndex={formIndex} branch={"request"} useFormMethods={formMethods} />
      </Box>
    )
  );
};
