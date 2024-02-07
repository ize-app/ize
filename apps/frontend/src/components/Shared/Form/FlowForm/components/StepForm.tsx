import { UseFieldArrayReturn, UseFormReturn, useFieldArray } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { Select, TextField } from "@/components/shared/Form/FormFields";

import { StepContainer, StepComponentContainer } from "./StepContainer";
import { PreviousStepResult, ResultFreeText, StepType } from "../types";
import { ResponseInputsForm } from "./ResponseInputsForm";
import { ResponsePermissionsForm } from "./ResponsePermissionsForm";
import { ResultForm } from "./ResultForm";
import { ActionsForm } from "./ActionsForm";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { RequestForm } from "./RequestForm";
import { ResponsiveFormRow } from "./ResponsiveFormRow";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  stepsArrayMethods: UseFieldArrayReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

const createStepNameLabel = (stepType: StepType): { label: string; placeholder: string } => {
  switch (stepType) {
    case StepType.Decide:
      return { label: "What are you deciding on?", placeholder: "" };
    case StepType.Prioritize:
      return { label: "What are you prioritizing?", placeholder: "" };
    case StepType.GetInput:
      return { label: "What are you asking for input on?", placeholder: "" };
  }
};

const createStepTitle = (stepType: StepType) => {
  switch (stepType) {
    case StepType.Decide:
      return "Decide";
    case StepType.Prioritize:
      return "Prioritize";
    case StepType.GetInput:
      return "Get input";
  }
};

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
  const stepName = watch(`steps.${formIndex}.name`);

  const previousStepResult: PreviousStepResult | null =
    formIndex > 0
      ? {
          stepName: watch(`steps.${formIndex - 1}.name`),
          stepType: watch(`steps.${formIndex - 1}.respond.inputs.type`),
          isAiSummary:
            watch(`steps.${formIndex - 1}.result.freeText.type`) === ResultFreeText.AiSummary,
        }
      : null;

  const isReusable = watch("reusable");

  const stepNameLabel = createStepNameLabel(stepType);
  const stepTitle = createStepTitle(stepType);

  return (
    <StepContainer>
      <Typography variant="h3">
        {/* <span style={{ fontWeight: "500" }}> */}
        Step {formIndex + 1}
        {/* </span> */}
        {stepTitle ? " " + stepTitle + (stepName ? ": " + stepName : "") : ""}
      </Typography>
      <StepComponentContainer>
        <ResponsiveFormRow>
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
          {stepType && (
            <TextField<NewFlowFormFields>
              name={`steps.${formIndex}.name`}
              control={useFormMethods.control}
              placeholderText={stepNameLabel.placeholder}
              label={stepNameLabel.label}
              variant="standard"
              width="400px"
            />
          )}
        </ResponsiveFormRow>
      </StepComponentContainer>
      {stepType && (
        <>
          {isReusable && (
            <RequestForm
              formMethods={useFormMethods}
              formIndex={formIndex}
              previousStepResult={previousStepResult}
            />
          )}
          <ResponseInputsForm
            formMethods={useFormMethods}
            formIndex={formIndex}
            previousStepResult={previousStepResult}
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
