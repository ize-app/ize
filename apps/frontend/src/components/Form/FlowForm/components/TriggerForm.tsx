import { UseFormReturn } from "react-hook-form";
import { RoleSearch, Select } from "../../formFields";
import { PermissionType } from "../formValidation/permission";
import { FlowSchemaType } from "../formValidation/flow";
import { FieldsForm } from "./FieldsForm";
import { Box } from "@mui/material";
import { FieldGroupAccordion } from "../../formLayout/FieldGroupAccordion";

interface TriggerFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const TriggerForm = ({ formMethods, formIndex, show }: TriggerFormProps) => {
  const isEntitiesRequestTrigger =
    formMethods.watch(`steps.${formIndex}.request.permission.type`) === PermissionType.Entities;

  const error = formMethods.formState.errors.steps?.[formIndex]?.request;

  return (
    formIndex === 0 && (
      <Box sx={{ display: show ? "block" : "none" }}>
        <FieldGroupAccordion title="Permission" hasError={!!error?.permission}>
          <Select
            control={formMethods.control}
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
        </FieldGroupAccordion>
        <FieldGroupAccordion title="Request fields" hasError={!!error?.fields}>
          <FieldsForm formIndex={formIndex} branch={"request"} useFormMethods={formMethods} />
        </FieldGroupAccordion>
      </Box>
    )
  );
};
