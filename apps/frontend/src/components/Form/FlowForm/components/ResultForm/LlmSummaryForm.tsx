import { UseFormReturn } from "react-hook-form";

import { TextField } from "../../../formFields";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../../formValidation/flow";
import { InputAdornment, Typography } from "@mui/material";
import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";

interface LlmSummaryProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  resultIndex: number;
  display: boolean;
}

export const LlmSummaryForm = ({
  formMethods,
  formIndex,
  resultIndex,
  display,
}: LlmSummaryProps) => {
  return (
    <FieldBlock sx={{ display: display ? "flex" : "none" }}>
      <Typography variant={"label2"}>AI summary configuration</Typography>
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
    </FieldBlock>
  );
};
