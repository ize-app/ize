import { Box, FormHelperText } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { ActionFilterForm } from "./ActionFilterForm";
import { PermissionForm } from "./PermissionForm";
import { ResultsForm } from "./ResultForm/ResultsForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Select, Switch } from "../../formFields";
import { FlowSchemaType } from "../formValidation/flow";

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
  const stepError = formMethods.formState.errors.steps?.[formIndex];

  const fieldsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.response.fields`,
  });

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
      {formIndex > 0 && (
        <ActionFilterForm
          formIndex={formIndex - 1}
          formMethods={formMethods}
          action={formMethods.getValues(`steps.${formIndex - 1}.action`)}
          isTriggerAction={true}
        />
      )}
      <PanelAccordion
        title="Permissions"
        hasError={
          !!formMethods.formState.errors.steps?.[formIndex]?.response ||
          !!formMethods.formState.errors.steps?.[formIndex]?.expirationSeconds ||
          !!formMethods.formState.errors.steps?.[formIndex]?.allowMultipleResponses
        }
      >
        <PermissionForm<FlowSchemaType>
          fieldName={`steps.${formIndex}.response.permission`}
          branch={"response"}
        />
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="How long do people have to respond?"
          renderValue={(val) => {
            const option = requestExpirationOptions.find((option) => option.value === val);
            return option?.name + " to respond";
          }}
          selectOptions={requestExpirationOptions}
          name={`steps.${formIndex}.expirationSeconds`}
          size={"small"}
        />
        <Switch<FlowSchemaType>
          name={`steps.${formIndex}.allowMultipleResponses`}
          control={formMethods.control}
          label="Allow multiple responses"
        />
      </PanelAccordion>
      <PanelAccordion
        title="Collaborations"
        hasError={!!formMethods.formState.errors.steps?.[formIndex]?.request?.fields}
      >
        <ResultsForm
          formIndex={formIndex}
          formMethods={formMethods}
          //@ts-expect-error TODO
          fieldsArrayMethods={fieldsArrayMethods}
        />
      </PanelAccordion>
    </Box>
  );
};
