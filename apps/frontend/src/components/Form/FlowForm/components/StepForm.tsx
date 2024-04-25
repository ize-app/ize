import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";

import { ResponseForm } from "./ResponseForm";
import { ResultType } from "@/graphql/generated/graphql";
import { ResultsForm } from "./ResultForm/ResultsForm";
import { Box } from "@mui/material";

interface StepFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const stepNameLabels = new Map<ResultType, { stepTitle: string }>([
  [ResultType.Decision, { stepTitle: "Decide" }],
  [ResultType.Ranking, { stepTitle: "Rank" }],
  [ResultType.LlmSummary, { stepTitle: "Sensemaking with AI" }],
]);

export interface PreviousStepResult {
  resultType: ResultType;
}

export const StepForm = ({ useFormMethods, formIndex, show }: StepFormProps) => {
  // console.log("form state for ", formIndex, " is ", getFieldValues());
  // console.log("errors are ", useFormMethods.formState.errors.steps?.[formIndex]);

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      <ResponseForm formMethods={useFormMethods} formIndex={formIndex} />
      <ResultsForm formMethods={useFormMethods} formIndex={formIndex} />
    </Box>
  );
};
