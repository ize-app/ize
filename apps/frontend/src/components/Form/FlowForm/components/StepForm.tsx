import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";

import { StepContainer } from "./StepContainer";
import { ResponseForm } from "./ResponseForm";
import { RequestForm } from "./RequestForm";
import { ResultType } from "@/graphql/generated/graphql";
import { ActionForm } from "./ActionForm";
import { ResultsForm } from "./ResultForm/ResultsForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
  stepsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
  expandedStep: number | "EvolveStep" | false;
  formIndex: number; // react-hook-form name
}

export const stepNameLabels = new Map<ResultType, { stepTitle: string }>([
  [ResultType.Decision, { stepTitle: "Decide" }],
  [ResultType.Ranking, { stepTitle: "Rank" }],
  [ResultType.LlmSummary, { stepTitle: "Sensemaking with AI" }],
]);

export interface PreviousStepResult {
  resultType: ResultType;
}

export const StepForm = ({
  useFormMethods,
  formIndex,
  stepsArrayMethods,
  handleStepExpansion,
  expandedStep,
}: StepFormProps) => {
  // const { getValues: getFieldValues } = useFormMethods;
  // console.log("form state for ", formIndex, " is ", getFieldValues());
  // console.log("errors are ", useFormMethods.formState.errors.steps?.[formIndex]);

  const hasError = !!useFormMethods.formState.errors.steps?.[formIndex];

  return (
    <StepContainer
      expandedStep={expandedStep}
      handleStepExpansion={handleStepExpansion}
      stepIdentifier={formIndex}
      hasError={hasError}
      title={` Step ${formIndex + 1}`}
    >
      <>
        <RequestForm formMethods={useFormMethods} formIndex={formIndex} />
        <ResponseForm formMethods={useFormMethods} formIndex={formIndex} />
        <ResultsForm formMethods={useFormMethods} formIndex={formIndex} />
        <ActionForm
          formMethods={useFormMethods}
          formIndex={formIndex}
          stepsArrayMethods={stepsArrayMethods}
        />
      </>
    </StepContainer>
  );
};
