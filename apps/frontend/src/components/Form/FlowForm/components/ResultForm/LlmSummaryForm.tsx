import { InputAdornment, Typography } from "@mui/material";

import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { ResultType } from "@/graphql/generated/graphql";

import { TextField } from "../../../formFields";
import { FlowSchemaType } from "../../formValidation/flow";

interface LlmSummaryProps {
  stepIndex: number; // react-hook-form name
  resultIndex: number;
  display: boolean;
  type: ResultType;
}

export const LlmSummaryForm = ({ stepIndex, resultIndex, display, type }: LlmSummaryProps) => {
  if (type !== ResultType.LlmSummary && type !== ResultType.LlmSummaryList) return null;
  return (
    <FieldBlock sx={{ display: display ? "flex" : "none" }}>
      <Typography variant={"label2"}>AI summary configuration</Typography>

      <TextField<FlowSchemaType>
        sx={{ width: "100%" }}
        label="Summarization instructions"
        variant="outlined"
        multiline
        placeholderText="Describe how you want the AI to summarize the responses."
        name={`steps.${stepIndex}.result.${resultIndex}.llmSummary.prompt`}
        size="small"
        // startAdornment={<InputAdornment position="start">AI prompt</InputAdornment>}
        showLabel={false}
        defaultValue="test"
      />
      <TextField<FlowSchemaType>
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
        name={`steps.${stepIndex}.result.${resultIndex}.llmSummary.example`}
        size="small"
        showLabel={false}
        defaultValue="test"
      />
      <TextField<FlowSchemaType>
        label="Minimum # of responses for a result"
        showLabel={false}
        size={"small"}
        defaultValue=""
        endAdornment={<InputAdornment position="end">responses minimum</InputAdornment>}
        name={`steps.${stepIndex}.result.${resultIndex}.minimumAnswers`}
      />
    </FieldBlock>
  );
};
