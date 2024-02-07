import { UseFieldArrayReturn, UseFormReturn, useFieldArray } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { Select } from "@/components/shared/Form/FormFields";

import { StepContainer, StepComponentContainer } from "./StepContainer";
import { StepType } from "../types";
import { ResponseInputsForm } from "./ResponseInputsForm";
import { ResponsePermissionsForm } from "./ResponsePermissionsForm";
import { ResultForm } from "./ResultForm";
import { ActionsForm } from "./ActionsForm";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { RequestForm } from "./RequestForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  stepsArrayMethods: UseFieldArrayReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const StepForm = ({ useFormMethods, formIndex, stepsArrayMethods }: StepFormProps) => {
  const {
    control,
    setValue: setFieldValue,
    getValues: getFieldValues,
    watch,
    getFieldState,
    formState,
  } = useFormMethods;

  console.log("form state for ", formIndex, " is ", getFieldValues());

  console.log("errors are ", useFormMethods.formState.errors);

  const stepType = watch(`steps.${formIndex}.respond.inputs.type`);

  return (
    <StepContainer>
      <Typography variant="h3">
        Step {formIndex + 1}
        {stepType ? ": " + stepType : ""}
      </Typography>
      <StepComponentContainer>
        <Select
          control={control}
          label="Purpose of this step"
          name={`steps.${formIndex}.respond.inputs.type`}
          width="300px"
          selectOptions={[
            { name: "Decide", value: StepType.Decide },
            { name: "Get ideas and feedback", value: StepType.GetInput },
            { name: "Prioritize", value: StepType.Prioritize },
          ]}
        />
      </StepComponentContainer>
      {stepType && (
        <>
          <RequestForm formMethods={useFormMethods} formIndex={formIndex} />
          <ResponseInputsForm
            formMethods={useFormMethods}
            formIndex={formIndex}
          />
          <ResponsePermissionsForm formMethods={useFormMethods} formIndex={formIndex} />
          <ResultForm formMethods={useFormMethods} formIndex={formIndex} />
          <ActionsForm
            formMethods={useFormMethods}
            formIndex={formIndex}
            stepsArrayMethods={stepsArrayMethods}
          />
        </>
      )}
    </StepContainer>
  );
};
