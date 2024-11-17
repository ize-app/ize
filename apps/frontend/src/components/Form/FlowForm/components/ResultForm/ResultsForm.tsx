import Close from "@mui/icons-material/Close";
import { Box, FormHelperText } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { UseFieldArrayReturn, useFieldArray, useFormContext } from "react-hook-form";

import { ResultType } from "@/graphql/generated/graphql";

import { AddResultButton } from "./AddResultButton";
import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { ResponseFieldOptionsForm } from "./ResponseFieldOptionsForm";
import { ResultFormSection } from "./ResultFormSection";
import { TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";
import { FlowSchemaType } from "../../formValidation/flow";
import { getResultFormLabel } from "../../helpers/getResultFormLabel";

const resultFieldNamePlaceholderText = (resultType: ResultType) => {
  switch (resultType) {
    case ResultType.Decision:
      return "What are you deciding on?";
    case ResultType.Ranking:
      return "Describe what you're trying to rank";
    case ResultType.LlmSummary:
      return "Add a question on instructions for how to respond";
    case ResultType.LlmSummaryList:
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
  fieldsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  resultsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  locked: boolean;
  reusable: boolean;
}

export const ResultsForm = ({ stepIndex, fieldsArrayMethods, reusable }: ResultsFormProps) => {
  const { control, getValues } = useFormContext<FlowSchemaType>();
  const resultsArrayMethods = useFieldArray<FlowSchemaType>({
    control,
    name: `steps.${stepIndex}.result`,
  });

  const locked = getValues(`steps.${stepIndex}.fieldSet.locked`);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* This hidden form is here so that the fields can be added to the response fields array */}
      {resultsArrayMethods.fields.map((item, resultIndex) => {
        return (
          <ResultForm
            key={item.id}
            stepIndex={stepIndex}
            resultIndex={resultIndex}
            fieldsArrayMethods={fieldsArrayMethods}
            id={item.id}
            locked={locked}
            reusable={reusable}
            resultsArrayMethods={resultsArrayMethods}
          />
        );
      })}
      <AddResultButton
        fieldsArrayMethods={fieldsArrayMethods}
        resultsArrayMethods={resultsArrayMethods}
      />
    </Box>
  );
};

const ResultForm = ({
  stepIndex,
  fieldsArrayMethods,
  id,
  resultsArrayMethods,
  resultIndex,
  locked,
  reusable,
}: ResultFormProps) => {
  const { getValues, formState } = useFormContext<FlowSchemaType>();

  const result = getValues(`steps.${stepIndex}.result.${resultIndex}`);
  const resultField = getValues(`steps.${stepIndex}.fieldSet.fields.${resultIndex}`);
  const resultType = result.type;

  const resultError = formState.errors?.steps?.[stepIndex]?.result?.[resultIndex]?.root?.message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "space-between",
      }}
      key={id}
    >
      <LabeledGroupedInputs
        label={getResultFormLabel({ result: result })}
        sx={{
          backgroundColor: "#fffff5",
          display: "flex",
          flexDirection: "column",
          padding: "12px",
          width: "100%",
        }}
      >
        <ResultFormSection label="Question that respondants will answer">
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
        </ResultFormSection>
        <ResultFormSection label="How result is created">
          {resultType === ResultType.Decision && (
            <DecisionConfigForm
              stepIndex={stepIndex}
              resultIndex={resultIndex}
              field={resultField}
              display={resultType === ResultType.Decision}
            />
          )}

          {(resultType === ResultType.LlmSummary || resultType === ResultType.LlmSummaryList) && (
            <LlmSummaryForm
              stepIndex={stepIndex}
              resultIndex={resultIndex}
              display={
                resultType === ResultType.LlmSummary || resultType === ResultType.LlmSummaryList
              }
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
        </ResultFormSection>

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
      </LabeledGroupedInputs>

      {!locked && (
        <IconButton
          color="primary"
          size="small"
          aria-label="Remove result"
          onClick={() => {
            resultsArrayMethods.remove(resultIndex);
            fieldsArrayMethods.remove(resultIndex);
          }}
          sx={{
            display: "flex",
            alignSelf: "right",
            flexShrink: 0, // Prevents the button from shrinking
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
