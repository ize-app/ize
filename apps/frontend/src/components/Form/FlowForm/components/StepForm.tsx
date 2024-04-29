import { UseFormReturn } from "react-hook-form";
import { FlowSchemaType } from "../formValidation/flow";
import { Box } from "@mui/material";
import { FieldGroupAccordion } from "../../formLayout/FieldGroupAccordion";
import { RoleSearch, Select, Switch } from "../../formFields";
import { PermissionType } from "../formValidation/permission";
import { FormHelperText } from "@mui/material";
import { ActionFilterForm } from "./ActionForm";
import { ResultsForm } from "./ResultForm/ResultsForm";

interface StepFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

const requestExpirationOptions = [
  { name: "1 hour", value: 3600 },
  { name: "4 hours", value: 14400 },
  { name: "1 day", value: 86400 },
  { name: "3 days", value: 259200 },
  { name: "7 days", value: 604800 },
  { name: "30 days", value: 2592000 },
];

export const StepForm = ({ formMethods: formMethods, formIndex, show }: StepFormProps) => {
  // console.log("form state for ", formIndex, " is ", getFieldValues());
  // console.log("errors are ", useFormMethods.formState.errors.steps?.[formIndex]);
  const responseTrigger = formMethods.watch(`steps.${formIndex}.response.permission.type`);
  const stepError = formMethods.getFieldState(`steps.${formIndex}`).error;

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      {stepError?.root && (
        <FormHelperText
          sx={{
            color: "error.main",
            marginLeft: "16px",
          }}
        >
          {stepError?.root.message}
        </FormHelperText>
      )}
      {formIndex > 0 && <ActionFilterForm formIndex={formIndex} formMethods={formMethods} />}
      <FieldGroupAccordion
        title="Response permissions"
        hasError={
          !!formMethods.formState.errors.steps?.[formIndex]?.response?.permission ||
          !!formMethods.formState.errors.steps?.[formIndex]?.expirationSeconds ||
          !!formMethods.formState.errors.steps?.[formIndex]?.allowMultipleResponses
        }
      >
        <Select<FlowSchemaType>
          control={formMethods.control}
          // width="300px"
          name={`steps.${formIndex}.response.permission.type`}
          selectOptions={[
            { name: "Certain people can respond", value: PermissionType.Entities },
            { name: "Anyone can respond", value: PermissionType.Anyone },
            {
              name: "No response: Automatically approve request",
              value: PermissionType.NA,
            },
          ]}
          label="Who can respond?"
          displayLabel={false}
          size="small"
        />
        {responseTrigger === PermissionType.Entities && (
          <RoleSearch<FlowSchemaType>
            key="responseRoleSearch"
            ariaLabel={"Individuals and groups who can respond"}
            name={`steps.${formIndex}.response.permission.entities`}
            control={formMethods.control}
            setFieldValue={formMethods.setValue}
            getFieldValues={formMethods.getValues}
          />
        )}
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="How long do people have to respond?"
          renderValue={(val) => {
            const option = requestExpirationOptions.find((option) => option.value === val);
            return option?.name + " to respond";
          }}
          selectOptions={requestExpirationOptions}
          name={`steps.${formIndex}.expirationSeconds`}
          displayLabel={false}
          size={"small"}
        />
        <Switch<FlowSchemaType>
          name={`steps.${formIndex}.allowMultipleResponses`}
          control={formMethods.control}
          label="Allow multiple responses"
        />
      </FieldGroupAccordion>
      <FieldGroupAccordion
        title="Results"
        hasError={!!formMethods.formState.errors.steps?.[formIndex]?.request?.fields}
      >
        <ResultsForm formIndex={formIndex} formMethods={formMethods} />
      </FieldGroupAccordion>
    </Box>
  );
};
