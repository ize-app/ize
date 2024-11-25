import { Box, FormHelperText, InputAdornment } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";

import { PermissionForm } from "./PermissionForm";
import { ResultsForm } from "./ResultForm/ResultsForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Select, Switch, TextField } from "../../formFields";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../formValidation/flow";

interface StepFormProps {
  stepIndex: number; // react-hook-form name
  show: boolean;
  reusable: boolean;
}

const requestExpirationOptions = [
  { name: "1 hour", value: 3600 },
  { name: "4 hours", value: 14400 },
  { name: "1 day", value: 86400 },
  { name: "3 days", value: 259200 },
  { name: "7 days", value: 604800 },
  { name: "30 days", value: 2592000 },
];

export const StepForm = ({ stepIndex, show, reusable }: StepFormProps) => {
  const { formState, control, getValues } = useFormContext<FlowSchemaType>();
  const stepError = formState.errors.steps?.[stepIndex];
  

  const fieldsArrayMethods = useFieldArray({
    control: control,
    name: `steps.${stepIndex}.fieldSet.fields`,
  });

  const fields = getValues(`steps.${stepIndex}.fieldSet.fields`);

  const allInternalFields = fields.every((field) => field.isInternal);

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
      {!allInternalFields && (
        <PanelAccordion
          title="Permissions"
          hasError={!!formState.errors.steps?.[stepIndex]?.response}
        >
          <PermissionForm<FlowSchemaType>
            fieldName={`steps.${stepIndex}.response.permission`}
            branch={"response"}
          />
          <ResponsiveFormRow>
            <Select<FlowSchemaType>
              label="How long do people have to respond?"
              renderValue={(val) => {
                const option = requestExpirationOptions.find((option) => option.value === val);
                return option?.name + " to respond";
              }}
              selectOptions={requestExpirationOptions}
              name={`steps.${stepIndex}.response.expirationSeconds`}
              size={"small"}
            />
            <TextField<FlowSchemaType>
              label="Minimum # of responses for a result"
              showLabel={false}
              size={"small"}
              defaultValue=""
              sx={{ width: "200px" }}
              endAdornment={<InputAdornment position="end">responses minimum</InputAdornment>}
              name={`steps.${stepIndex}.response.minResponses`}
            />
          </ResponsiveFormRow>
          <Switch<FlowSchemaType>
            name={`steps.${stepIndex}.response.allowMultipleResponses`}
            label="Allow multiple responses"
          />
          <Switch<FlowSchemaType>
            name={`steps.${stepIndex}.response.canBeManuallyEnded`}
            label="Allow triggerer to end step early"
          />
        </PanelAccordion>
      )}
      <ResultsForm
        reusable={reusable}
        stepIndex={stepIndex}
        fieldsArrayMethods={fieldsArrayMethods}
      />
    </Box>
  );
};
