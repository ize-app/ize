import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";

import { StepContainer } from "./StepContainer";
import { ResponseForm } from "./ResponseForm";
import { ResultType } from "@/graphql/generated/graphql";
import { ResultsForm } from "./ResultForm/ResultsForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
  stepsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
  expandedStep: string | false;
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
  handleStepExpansion,
  expandedStep,
}: StepFormProps) => {
  // console.log("form state for ", formIndex, " is ", getFieldValues());
  // console.log("errors are ", useFormMethods.formState.errors.steps?.[formIndex]);

  const hasError =
    !!useFormMethods.formState.errors.steps?.[formIndex]?.response ||
    !!useFormMethods.formState.errors.steps?.[formIndex]?.result ||
    !!useFormMethods.formState.errors.steps?.[formIndex]?.allowMultipleResponses ||
    !!useFormMethods.formState.errors.steps?.[formIndex]?.expirationSeconds;

  return (
    <StepContainer
      expandedStep={expandedStep}
      handleStepExpansion={handleStepExpansion}
      stepIdentifier={"step" + formIndex.toString()}
      hasError={hasError}
      title={`Collab (${formIndex + 1})`}
    >
      <>
        <ResponseForm formMethods={useFormMethods} formIndex={formIndex} />
        <ResultsForm formMethods={useFormMethods} formIndex={formIndex} />
      </>
    </StepContainer>
  );
};
