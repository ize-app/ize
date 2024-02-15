import { UseFormReturn } from "react-hook-form";

import { Select, TextField } from "../../../FormFields";

import { ResponsiveFormRow } from "../ResponsiveFormRow";

import { ResultType } from "@/graphql/generated/graphql";
import { useEffect } from "react";
import { FlowSchemaType } from "../../formValidation/flow";

import { LlmSummaryType } from "../../formValidation/result";
import { InputAdornment } from "@mui/material";

interface LlmSummaryProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const LlmSummaryForm = ({ formMethods, formIndex }: LlmSummaryProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.result.type`, ResultType.LlmSummary);
  }, []);

  return (
    <ResponsiveFormRow>
      <Select<FlowSchemaType>
        control={formMethods.control}
        label="Default option"
        width="300px"
        selectOptions={[
          { name: "AI summary after every response", value: LlmSummaryType.AfterEveryResponse },
          { name: "AI summary at the end", value: LlmSummaryType.AtTheEnd },
        ]}
        displayLabel={false}
        size="small"
        name={`steps.${formIndex}.result.llmSummary.type`}
      />
      <TextField<FlowSchemaType>
        control={formMethods.control}
        width="600px"
        label="Prompt to help AI summarize responses"
        variant="standard"
        placeholderText="Optional"
        name={`steps.${formIndex}.result.llmSummary.prompt`}
        size="small"
        startAdornment={<InputAdornment position="start">AI prompt</InputAdornment>}
        showLabel={false}
      />
    </ResponsiveFormRow>
  );
};
