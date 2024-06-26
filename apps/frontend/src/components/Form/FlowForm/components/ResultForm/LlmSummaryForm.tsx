import { InputAdornment, Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { ResultType } from "@/graphql/generated/graphql";

import { TextField } from "../../../formFields";
import { FlowSchemaType } from "../../formValidation/flow";

interface LlmSummaryProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  resultIndex: number;
  display: boolean;
  type: ResultType;
}

export const LlmSummaryForm = ({
  formMethods,
  formIndex,
  resultIndex,
  display,
  type,
}: LlmSummaryProps) => {
  if (type !== ResultType.LlmSummary && type !== ResultType.LlmSummaryList) return null;
  return (
    <FieldBlock sx={{ display: display ? "flex" : "none" }}>
      <Typography variant={"label2"}>AI summary configuration</Typography>

      <TextField<FlowSchemaType>
        control={formMethods.control}
        sx={{ width: "100%" }}
        label="Summarization instructions"
        variant="outlined"
        multiline
        placeholderText="Describe how you want the AI to summarize the responses."
        name={`steps.${formIndex}.result.${resultIndex}.llmSummary.prompt`}
        size="small"
        // startAdornment={<InputAdornment position="start">AI prompt</InputAdornment>}
        showLabel={false}
        defaultValue="test"
      />
      <TextField<FlowSchemaType>
        control={formMethods.control}
        sx={{ width: "100%" }}
        label="Example output"
        variant="outlined"
        multiline
        required={false}
        placeholderText={
          type !== ResultType.LlmSummaryList
            ? "Example output for an item in the AI generated list"
            : "Example output of the AI summarization."
        }
        name={`steps.${formIndex}.result.${resultIndex}.llmSummary.example`}
        size="small"
        showLabel={false}
        defaultValue="test"
      />
      <TextField<FlowSchemaType>
        control={formMethods.control}
        label="Minimum # of responses for a result"
        showLabel={false}
        size={"small"}
        defaultValue=""
        endAdornment={<InputAdornment position="end">responses minimum</InputAdornment>}
        name={`steps.${formIndex}.result.${resultIndex}.minimumAnswers`}
      />
    </FieldBlock>
  );
};
