import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { Select, TextField } from "@/components/shared/Form/FormFields";

import { StepContainer } from "./StepContainer";
import { PreviousStepResult, ResultFreeText, StepType } from "../types";
import { ResponseFieldsForm } from "./ResponseFieldsForm";
import { ResponsePermissionsForm } from "./ResponsePermissionsForm";
import { ResultForm } from "./ResultForm";
import { ActionsForm } from "./ActionsForm";
import { RequestForm } from "./RequestForm";
import { ResponsiveFormRow } from "./ResponsiveFormRow";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  stepsArrayMethods: UseFieldArrayReturn<NewFlowFormFields>;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
  expandedStep: number | false;
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

export const StepForm = ({
  useFormMethods,
  formIndex,
  stepsArrayMethods,
  handleStepExpansion,
  expandedStep,
}: StepFormProps) => {
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

  // const [sectionExpanded, setSectionExpanded] = useState<string | false>(false);

  // const handleSectionExpansion =
  //   (sectionName: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
  //     setSectionExpanded(newExpanded ? sectionName : false);
  //   };

  const stepType = watch(`steps.${formIndex}.type`);
  const stepName = watch(`steps.${formIndex}.name`);

  const previousStepResult: PreviousStepResult | null =
    formIndex > 0
      ? {
          stepName: watch(`steps.${formIndex - 1}.name`) ?? "",
          stepType: watch(`steps.${formIndex - 1}.type`),
          isAiSummary:
            watch(`steps.${formIndex - 1}.result.freeText.type`) === ResultFreeText.AiSummary,
        }
      : null;

  const isReusable = watch("reusable");

  const stepNameLabel = createStepNameLabel(stepType as StepType);
  const stepTitle = createStepTitle(stepType as StepType);

  return (
    <StepContainer
      expandedStep={expandedStep}
      handleStepExpansion={handleStepExpansion}
      stepIndex={formIndex}
      title={` Step ${formIndex + 1} ${
        stepTitle ? stepTitle + (stepName ? ": " + stepName : "") : ""
      }`}
    >
      {/* <StepComponentContainer> */}
      <ResponsiveFormRow>
        <Select
          control={control}
          label="Purpose of this step"
          name={`steps.${formIndex}.type`}
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
      {/* </StepComponentContainer> */}
      {stepType && (
        <>
          {isReusable && (
            <RequestForm
              formMethods={useFormMethods}
              formIndex={formIndex}
              previousStepResult={previousStepResult}
            />
          )}
          <ResponseFieldsForm
            stepType={stepType}
            formMethods={useFormMethods}
            formIndex={formIndex}
            previousStepResult={previousStepResult}
          />
          <ResponsePermissionsForm
            formMethods={useFormMethods}
            formIndex={formIndex}
            stepType={stepType}
          />
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
