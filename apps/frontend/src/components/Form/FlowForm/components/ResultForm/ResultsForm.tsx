import { Box, FormHelperText } from "@mui/material";
import { useState } from "react";
import { UseFieldArrayReturn, useFieldArray, useFormContext } from "react-hook-form";

import { PanelAccordion } from "@/components/ConfigDiagram";
import { ResultType } from "@/graphql/generated/graphql";

import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { ResponseFieldOptionsForm } from "./ResponseFieldOptionsForm";
import ResultsToggle from "./ResultsToggle";
import { TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";
import { FlowSchemaType } from "../../formValidation/flow";

const resultFieldNamePlaceholderText = (resultType: ResultType) => {
  switch (resultType) {
    case ResultType.Decision:
      return "What are you deciding on?";
    case ResultType.Ranking:
      return "Describe what you're trying to rank";
    case ResultType.LlmSummary:
      return "Add a question on instructions for how to respond";
    default:
      return "What's your question?";
  }
};

interface ResultsFormProps {
  stepIndex: number; // react-hook-form name
  fieldsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  reusable: boolean;
}

interface ResultFormProps {
  stepIndex: number; // react-hook-form name
  resultIndex: number;
  id: string;
  locked: boolean;
  reusable: boolean;
  display: boolean;
}

export const ResultsForm = ({ stepIndex, fieldsArrayMethods, reusable }: ResultsFormProps) => {
  const { control, getValues, formState } = useFormContext<FlowSchemaType>();
  const [resultIndex, setResultIndex] = useState(0);

  const resultsArrayMethods = useFieldArray<FlowSchemaType>({
    control,
    name: `steps.${stepIndex}.result`,
  });

  const locked = getValues(`steps.${stepIndex}.fieldSet.locked`);

  return (
    // <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    <PanelAccordion
      title={"Results"}
      hasError={
        !!formState.errors.steps?.[stepIndex]?.fieldSet ||
        !!formState.errors.steps?.[stepIndex]?.result
      }
    >
      <ResultsToggle
        stepIndex={stepIndex}
        resultIndex={resultIndex}
        setResultIndex={setResultIndex}
        locked={locked}
        fieldsArrayMethods={fieldsArrayMethods}
        resultsArrayMethods={resultsArrayMethods}
      />
      <hr style={{ width: "100%", borderTop: "1px solid rgba(0, 0, 0, 0.1)" }} />
      {/* This hidden form is here so that the fields can be added to the response fields array */}
      {resultsArrayMethods.fields.map((item, resIndex) => {
        return (
          <ResultForm
            key={item.id}
            stepIndex={stepIndex}
            resultIndex={resIndex}
            id={item.id}
            locked={locked}
            reusable={reusable}
            display={resultIndex === resIndex}
          />
        );
      })}
    </PanelAccordion>
    // </Box>
  );
};

const ResultForm = ({ stepIndex, id, resultIndex, locked, reusable, display }: ResultFormProps) => {
  const { getValues, formState } = useFormContext<FlowSchemaType>();

  const result = getValues(`steps.${stepIndex}.result.${resultIndex}`);
  const resultField = getValues(`steps.${stepIndex}.fieldSet.fields.${resultIndex}`);
  const resultType = result.type;

  const resultError = formState.errors?.steps?.[stepIndex]?.result?.[resultIndex]?.root?.message;

  return (
    <Box
      sx={{
        display: display ? "flex" : "none",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        paddingBottom: "40px",
      }}
      key={id}
    >
      <LabeledGroupedInputs
        label="Question"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "16px",
          width: "100%",
        }}
      >
        <TextField<FlowSchemaType>
          // assuming here that results to fields is 1:1 relationshp
          name={`steps.${stepIndex}.fieldSet.fields.${resultIndex}.name`}
          key={"fieldName" + resultIndex.toString() + stepIndex.toString()}
          disabled={locked}
          multiline
          placeholderText={resultFieldNamePlaceholderText(resultType)}
          label={``}
          defaultValue=""
        />

        {(resultType === ResultType.Decision || resultType === ResultType.Ranking) && (
          <ResponseFieldOptionsForm
            reusable={reusable}
            stepIndex={stepIndex}
            fieldIndex={resultIndex}
            locked={locked}
          />
        )}
      </LabeledGroupedInputs>
      <LabeledGroupedInputs
        label="Result"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "16px",
          width: "100%",
        }}
      >
        {resultType === ResultType.Decision && (
          <DecisionConfigForm
            stepIndex={stepIndex}
            resultIndex={resultIndex}
            field={resultField}
            display={resultType === ResultType.Decision}
          />
        )}

        {resultType === ResultType.LlmSummary && (
          <LlmSummaryForm
            stepIndex={stepIndex}
            resultIndex={resultIndex}
            display={resultType === ResultType.LlmSummary}
            type={resultType}
          />
        )}

        {resultType === ResultType.Ranking && (
          <PrioritizationForm
            formIndex={stepIndex}
            resultIndex={resultIndex}
            field={resultField}
            display={resultType === ResultType.Ranking}
          />
        )}
      </LabeledGroupedInputs>

      {resultError && (
        <FormHelperText
          sx={{
            color: "error.main",
            marginLeft: "16px",
          }}
        >
          {resultError}
        </FormHelperText>
      )}
    </Box>
  );
};
