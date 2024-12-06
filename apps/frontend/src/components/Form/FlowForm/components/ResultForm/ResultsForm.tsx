import { Box, FormHelperText, Typography } from "@mui/material";
import { useState } from "react";
import { UseFieldArrayReturn, useFieldArray, useFormContext } from "react-hook-form";

import { PanelAccordion } from "@/components/ConfigDiagram";
import { ResultType } from "@/graphql/generated/graphql";

import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { ResponseFieldOptionsForm } from "./ResponseFieldOptionsForm";
import ResultsToggle from "./ResultsToggle";
import { Select, TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";
import { FlowSchemaType } from "../../formValidation/flow";
import { defaultFreeInputDefaultOptions } from "../../helpers/defaultFreeInputDataTypeOptions";

const resultFieldNamePlaceholderText = (resultType: ResultType) => {
  switch (resultType) {
    case ResultType.Decision:
      return "What are you deciding on?";
    case ResultType.Ranking:
      return "Describe what you're trying to rank";
    case ResultType.LlmSummary:
      return "Add a question or instructions for how to respond";
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
  locked: boolean;
  reusable: boolean;
  display: boolean;
}

export const ResultsForm = ({ stepIndex, fieldsArrayMethods, reusable }: ResultsFormProps) => {
  const { control, getValues, formState } = useFormContext<FlowSchemaType>();
  const [resultIndex, setResultIndex] = useState(0);

  const resultsArrayMethods = useFieldArray<FlowSchemaType, `steps.${number}.result`>({
    control,
    name: `steps.${stepIndex}.result`,
  });

  const locked = getValues(`steps.${stepIndex}.fieldSet.locked`);

  return (
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
      {resultsArrayMethods.fields.map((item, resIndex) => {
        return (
          <ResultForm
            key={item.id}
            stepIndex={stepIndex}
            resultIndex={resIndex}
            locked={locked}
            reusable={reusable}
            display={resultIndex === resIndex}
          />
        );
      })}
    </PanelAccordion>
  );
};

const ResultForm = ({ stepIndex, resultIndex, locked, reusable, display }: ResultFormProps) => {
  const { getValues, formState } = useFormContext<FlowSchemaType>();

  const result = getValues(`steps.${stepIndex}.result.${resultIndex}`);
  const resultField = getValues(`steps.${stepIndex}.fieldSet.fields.${resultIndex}`);
  const resultType = result?.type;

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
          disabled={locked}
          multiline
          placeholderText={resultFieldNamePlaceholderText(resultType)}
          label={``}
          defaultValue=""
        />
        {resultType === ResultType.RawAnswers && (
          <Select<FlowSchemaType>
            size={"small"}
            disabled={locked}
            name={`steps.${stepIndex}.fieldSet.fields.${resultIndex}.type`}
            selectOptions={defaultFreeInputDefaultOptions}
            label="Free input data type"
            defaultValue=""
          />
        )}

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
        {resultType === ResultType.RawAnswers && (
          <Typography variant="description">
            This result is simply the list of answers from respondants
          </Typography>
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
