import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../../formValidation/flow";
import { Select, TextField } from "../../../FormFields";

import { StepComponentContainer } from "../StepContainer";
import { ResponsiveFormRow } from "../ResponsiveFormRow";
import InputAdornment from "@mui/material/InputAdornment";

import { ResultType } from "@/graphql/generated/graphql";
import { DecisionForm } from "./DecisionForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { ActionForm } from "./ActionForm";

interface ResultFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  stepsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
}

const requestExpirationOptions = [
  { name: "1 hour", value: 3600 },
  { name: "4 hours", value: 14400 },
  { name: "1 day", value: 86400 },
  { name: "3 days", value: 259200 },
  { name: "7 days", value: 604800 },
  { name: "30 days", value: 2592000 },
];

export const ResultForm = ({ formMethods, formIndex, stepsArrayMethods }: ResultFormProps) => {
  const resultType = formMethods.watch(`steps.${formIndex}.result.type`);

  return (
    <StepComponentContainer label={"Result"}>
      <>
        <ResponsiveFormRow>
          <Select<FlowSchemaType>
            control={formMethods.control}
            label="What's the final result?"
            width="300px"
            selectOptions={[
              { name: "Decision", value: ResultType.Decision },
              { name: "Prioritized options", value: ResultType.Ranking },
              { name: "AI summary of all responses", value: ResultType.LlmSummary },
              { name: "Just the responses", value: ResultType.Raw },
              { name: "Auto-approve a request", value: ResultType.AutoApprove },
            ]}
            name={`steps.${formIndex}.result.type`}
            size="small"
            displayLabel={false}
          />
        </ResponsiveFormRow>
        {resultType === ResultType.Decision && (
          <DecisionForm formIndex={formIndex} formMethods={formMethods} />
        )}
        {resultType === ResultType.Ranking && (
          <PrioritizationForm formIndex={formIndex} formMethods={formMethods} />
        )}
        {resultType === ResultType.LlmSummary && (
          <LlmSummaryForm formIndex={formIndex} formMethods={formMethods} />
        )}
        <ResponsiveFormRow>
          <Select<FlowSchemaType>
            control={formMethods.control}
            label="How long do people have to respond?"
            width="300px"
            renderValue={(val) => {
              const option = requestExpirationOptions.find((option) => option.value === val);
              return "Request expires in " + option?.name;
            }}
            selectOptions={requestExpirationOptions}
            name={`steps.${formIndex}.expirationSeconds`}
            displayLabel={false}
            size={"small"}
          />
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="300px"
            label="Minimum # of responses for a result"
            showLabel={false}
            variant="standard"
            size={"small"}
            endAdornment={
              <InputAdornment position="end">response minimum for a result</InputAdornment>
            }
            name={`steps.${formIndex}.result.minimumResponses`}
          />
        </ResponsiveFormRow>
        <ActionForm
          formMethods={formMethods}
          formIndex={formIndex}
          stepsArrayMethods={stepsArrayMethods}
        />
      </>
    </StepComponentContainer>
  );
};
