import Close from "@mui/icons-material/Close";
import { Box, FormHelperText } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { FieldOptionsSelectionType, FieldType, ResultType } from "@/graphql/generated/graphql";

import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { ResponseFieldOptionsForm } from "./ResponseFieldOptionsForm";
import { Select, TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";
import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";
import { ResultSchemaType } from "../../formValidation/result";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";
import { createDefaultResultState } from "../../helpers/defaultFormState/createDefaultResultState";

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
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  fieldsArrayMethods: ReturnType<typeof useFieldArray>;
}

interface ResultFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  stepIndex: number; // react-hook-form name
  resultIndex: number;
  id: string;
  fieldsArrayMethods: ReturnType<typeof useFieldArray>;
  resultsArrayMethods: ReturnType<typeof useFieldArray>;
  locked: boolean;
}

export const ResultsForm = ({ formMethods, formIndex, fieldsArrayMethods }: ResultsFormProps) => {
  const resultsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.result`,
  });

  const locked = formMethods.getValues(`steps.${formIndex}.fieldSet.locked`);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* This hidden form is here so that the fields can be added to the response fields array */}
      {resultsArrayMethods.fields.map((item, resultIndex) => {
        return (
          <ResultForm
            key={item.id}
            formMethods={formMethods}
            stepIndex={formIndex}
            resultIndex={resultIndex}
            fieldsArrayMethods={fieldsArrayMethods}
            id={item.id}
            locked={locked}
            //@ts-expect-error TODO
            resultsArrayMethods={resultsArrayMethods}
          />
        );
      })}
      <Box>
        <Button
          sx={{ flexGrow: 0 }}
          variant="outlined"
          size="small"
          onClick={() => {
            const field = createDefaultFieldState({
              fieldType: FieldType.Options,
              selectionType: FieldOptionsSelectionType.Select,
            });
            fieldsArrayMethods.append(field);
            const result = createDefaultResultState({
              resultType: ResultType.Decision,
              fieldId: field.fieldId,
            });
            resultsArrayMethods.append(result);
          }}
        >
          Add result
        </Button>
      </Box>
    </Box>
  );
};

const ResultForm = ({
  formMethods,
  stepIndex: formIndex,
  fieldsArrayMethods,
  id,
  resultsArrayMethods,
  resultIndex,
  locked,
}: ResultFormProps) => {
  const resultType = formMethods.watch(`steps.${formIndex}.result.${resultIndex}.type`);

  const resultField = formMethods.getValues(`steps.${formIndex}.fieldSet.fields.${resultIndex}`);

  const [prevResultType, setPrevResultType] = useState<ResultType | undefined>(resultType);
  const [displayForm, setDisplayForm] = useState<boolean>(true);

  useEffect(() => {
    // only run logic if result type has changed, but not on first render
    if (prevResultType && resultType && resultType !== prevResultType) {
      const field: FieldSchemaType = createDefaultFieldState({
        fieldType:
          resultType === ResultType.Ranking || resultType === ResultType.Decision
            ? FieldType.Options
            : FieldType.FreeInput,
        selectionType:
          resultType === ResultType.Ranking
            ? FieldOptionsSelectionType.Rank
            : FieldOptionsSelectionType.Select,
      });
      const result: ResultSchemaType = createDefaultResultState({
        resultType,
        fieldId: field.fieldId,
      });
      formMethods.setValue(`steps.${formIndex}.fieldSet.fields.${resultIndex}`, field);
      formMethods.setValue(`steps.${formIndex}.result.${resultIndex}`, result);
      setDisplayForm(true);
    }
    setPrevResultType(resultType);
  }, [resultType]);

  const resultError =
    formMethods.formState.errors?.steps?.[formIndex]?.result?.[resultIndex]?.root?.message;

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
      <LabeledGroupedInputs>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "12px",
            width: "100%",
            backgroundColor: "#fffff5",
          }}
        >
          <FieldBlock>
            <Select<FlowSchemaType>
              label="What's the final result?"
              disabled={locked}
              selectOptions={[
                { name: "Decision", value: ResultType.Decision },
                { name: "Ranked list", value: ResultType.Ranking },
                { name: "AI generated summary", value: ResultType.LlmSummary },
                { name: "AI generated list", value: ResultType.LlmSummaryList },
              ]}
              name={`steps.${formIndex}.result.${resultIndex}.type`}
              onChange={() => setDisplayForm(false)}
              size="small"
              defaultValue=""
            />
            <TextField<FlowSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`steps.${formIndex}.fieldSet.fields.${resultIndex}.name`}
              key={"fieldName" + resultIndex.toString() + formIndex.toString()}
              disabled={locked}
              multiline
              placeholderText={resultFieldNamePlaceholderText(resultType)}
              label={``}
              defaultValue=""
            />
          </FieldBlock>
          {(resultType === ResultType.Decision || resultType === ResultType.Ranking) &&
            displayForm && (
              <ResponseFieldOptionsForm
                stepIndex={formIndex}
                fieldIndex={resultIndex}
                locked={locked}
              />
            )}
          {resultType === ResultType.Decision && displayForm && (
            <DecisionConfigForm
              formIndex={formIndex}
              formMethods={formMethods}
              resultIndex={resultIndex}
              field={resultField}
              display={resultType === ResultType.Decision}
            />
          )}

          {(resultType === ResultType.LlmSummary || resultType === ResultType.LlmSummaryList) &&
            displayForm && (
              <LlmSummaryForm
                formIndex={formIndex}
                formMethods={formMethods}
                resultIndex={resultIndex}
                display={
                  resultType === ResultType.LlmSummary || resultType === ResultType.LlmSummaryList
                }
                type={resultType}
              />
            )}

          {resultType === ResultType.Ranking && displayForm && (
            <PrioritizationForm
              formIndex={formIndex}
              formMethods={formMethods}
              resultIndex={resultIndex}
              field={resultField}
              display={resultType === ResultType.Ranking}
            />
          )}
        </Box>
        <FormHelperText
          sx={{
            color: "error.main",
            marginLeft: "16px",
          }}
        >
          {resultError}
        </FormHelperText>
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
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
