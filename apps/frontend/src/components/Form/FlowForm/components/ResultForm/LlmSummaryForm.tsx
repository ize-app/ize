import { UseFormReturn } from "react-hook-form";

import { TextField } from "../../../formFields";

import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";

import { ResultType } from "@/graphql/generated/graphql";
import { useEffect } from "react";
import { FlowSchemaType } from "../../formValidation/flow";

import { LlmSummaryType } from "../../formValidation/result";
import { InputAdornment } from "@mui/material";
import { DefaultFieldSelection } from "../../formValidation/fields";

interface LlmSummaryProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  resultIndex: number;
  resultId: string;
}

export const LlmSummaryForm = ({
  formMethods,
  formIndex,
  resultIndex,
  resultId,
}: LlmSummaryProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.result.${resultIndex}`, {
      type: ResultType.LlmSummary,
      fieldId: DefaultFieldSelection.None,
      resultId,
      llmSummary: {
        type: LlmSummaryType.AfterEveryResponse,
        prompt: "sdfdf",
      },
      minimumAnswers: 1,
    });
  }, []);

  return (
    <ResponsiveFormRow>
      <TextField<FlowSchemaType>
        control={formMethods.control}
        sx={{ width: "100%" }}
        label="Prompt to help AI summarize responses"
        variant="standard"
        placeholderText="Optional"
        name={`steps.${formIndex}.result.${resultIndex}.llmSummary.prompt`}
        size="small"
        startAdornment={<InputAdornment position="start">AI prompt</InputAdornment>}
        showLabel={false}
      />
    </ResponsiveFormRow>
  );
};
