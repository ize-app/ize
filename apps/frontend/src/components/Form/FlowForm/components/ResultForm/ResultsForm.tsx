import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FlowSchemaType } from "../../formValidation/flow";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { Select, TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";

import {
  DecisionType,
  FieldOptionsSelectionType,
  FieldType,
  ResultType,
} from "@/graphql/generated/graphql";
import { Box, FormHelperText } from "@mui/material";
import { ResultSchemaType } from "../../formValidation/result";
import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { FieldOptionsForm } from "../FieldOptionsForm";
import Close from "@mui/icons-material/Close";
import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { FieldsForm } from "../FieldsForm";
import { useEffect, useState } from "react";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";
import { FieldSchemaType } from "../../formValidation/fields";
import { createDefaultResultState } from "../../helpers/defaultFormState/createDefaultResultState";

const resultFieldNamePlaceholderText = (resultType: ResultType) => {
  switch (resultType) {
    case ResultType.Decision:
      return "What are you deciding on?";
    case ResultType.Ranking:
      return "Describe what you're trying to rank";
    case ResultType.LlmSummary:
      return "What's your question to the group?";
    case ResultType.LlmSummaryList:
      return "What's your question to the group?";
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
  formIndex: number; // react-hook-form name
  resultIndex: number;
  id: string;
  fieldsArrayMethods: ReturnType<typeof useFieldArray>;
  resultsArrayMethods: ReturnType<typeof useFieldArray>;
}

export const ResultsForm = ({ formMethods, formIndex, fieldsArrayMethods }: ResultsFormProps) => {
  const { watch } = formMethods;

  const resultsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.result`,
  });

  const results = watch(`steps.${formIndex}.result`) ?? [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* This hidden form is here so that the fields can be added to the response fields array */}
      <Box sx={{ display: "none" }}>
        <FieldsForm
          formMethods={formMethods}
          formIndex={formIndex}
          fieldsArrayMethods={fieldsArrayMethods}
          branch="response"
        />
      </Box>
      {resultsArrayMethods.fields.map((item, resultIndex) => {
        return (
          <ResultForm
            key={item.id}
            formMethods={formMethods}
            formIndex={formIndex}
            resultIndex={resultIndex}
            fieldsArrayMethods={fieldsArrayMethods}
            id={item.id}
            //@ts-ignore
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
              stepIndex: formIndex,
              fieldIndex: results.length,
              selectionType: FieldOptionsSelectionType.Select,
            });
            fieldsArrayMethods.append(field);
            const result = createDefaultResultState({
              resultType: ResultType.Decision,
              stepIndex: formIndex,
              resultIndex: results.length,
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
  formIndex,
  fieldsArrayMethods,
  id,
  resultsArrayMethods,
  resultIndex,
}: ResultFormProps) => {
  const result = formMethods.watch(`steps.${formIndex}.result.${resultIndex}`);
  const resultType = result.type;
  const resultField = formMethods.watch(`steps.${formIndex}.response.fields.${resultIndex}`);
  const optionSelectionType =
    resultField.type === FieldType.Options ? resultField.optionsConfig.selectionType : null;

  const [prevResultType, setPrevResultType] = useState<ResultType | undefined>(undefined);

  useEffect(() => {
    // only run logic if result type has changed, but not on first render
    if (prevResultType && resultType && resultType !== prevResultType) {
      let field: FieldSchemaType;
      if (resultType === ResultType.Decision) {
        field = createDefaultFieldState({
          fieldType: FieldType.Options,
          stepIndex: formIndex,
          fieldIndex: resultIndex,
          selectionType: FieldOptionsSelectionType.Select,
        });
      } else if (resultType === ResultType.Ranking) {
        field = createDefaultFieldState({
          fieldType: FieldType.Options,
          stepIndex: formIndex,
          fieldIndex: resultIndex,
          selectionType: FieldOptionsSelectionType.Rank,
        });
      } else if (resultType === ResultType.LlmSummary) {
        field = createDefaultFieldState({
          fieldType: FieldType.FreeInput,
          stepIndex: formIndex,
          fieldIndex: resultIndex,
        });
      } else if (resultType === ResultType.LlmSummaryList) {
        field = createDefaultFieldState({
          fieldType: FieldType.FreeInput,
          stepIndex: formIndex,
          fieldIndex: resultIndex,
        });
      } else {
        throw new Error(`Unknown result type ${resultType}`);
      }
      let result: ResultSchemaType = createDefaultResultState({
        resultType,
        stepIndex: formIndex,
        resultIndex: resultIndex,
        fieldId: field.fieldId,
      });
      formMethods.setValue(`steps.${formIndex}.response.fields.${resultIndex}`, field);
      formMethods.setValue(`steps.${formIndex}.result.${resultIndex}`, result);
    }
    setPrevResultType(resultType);
  }, [resultType]);

  useEffect(() => {
    if (optionSelectionType) {
      if (optionSelectionType === FieldOptionsSelectionType.Rank) {
        formMethods.setValue(
          `steps.${formIndex}.response.fields.${resultIndex}.optionsConfig.maxSelections`,
          undefined,
        );
        formMethods.setValue(
          `steps.${formIndex}.result.${resultIndex}.decision.type`,
          DecisionType.WeightedAverage,
        );
      } else if (optionSelectionType === FieldOptionsSelectionType.Select) {
        formMethods.setValue(
          `steps.${formIndex}.result.${resultIndex}.decision.type`,
          DecisionType.NumberThreshold,
        );
      } else if (optionSelectionType === FieldOptionsSelectionType.MultiSelect) {
        formMethods.setValue(
          `steps.${formIndex}.result.${resultIndex}.decision.type`,
          DecisionType.WeightedAverage,
        );
      }
    }
  }, [optionSelectionType]);

  const resultError =
    formMethods.getFieldState(`steps.${formIndex}.result.${resultIndex}`).error?.root?.message ??
    "";

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
          <Box sx={{ display: "none" }}>
            <TextField<FlowSchemaType>
              name={`steps.${formIndex}.result.${resultIndex}.resultId`}
              key={"resultId" + resultIndex.toString() + formIndex.toString()}
              control={formMethods.control}
              showLabel={false}
              label={`Result ID - ignore`}
              variant="standard"
              disabled={true}
              defaultValue=""
              size="small"
            />
            <TextField<FlowSchemaType>
              name={`steps.${formIndex}.result.${resultIndex}.fieldId`}
              key={"fieldId" + resultIndex.toString() + formIndex.toString()}
              control={formMethods.control}
              label="fieldId"
              disabled={true}
              defaultValue=""
            />
          </Box>
          <FieldBlock>
            <Select<FlowSchemaType>
              control={formMethods.control}
              label="What's the final result?"
              selectOptions={[
                { name: "Decision", value: ResultType.Decision },
                { name: "Ranked list", value: ResultType.Ranking },
                { name: "AI generated summary", value: ResultType.LlmSummary },
                { name: "AI generated list", value: ResultType.LlmSummaryList },
              ]}
              name={`steps.${formIndex}.result.${resultIndex}.type`}
              size="small"
              displayLabel={false}
              defaultValue=""
            />
            <TextField<FlowSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`steps.${formIndex}.response.fields.${resultIndex}.name`}
              key={"fieldName" + resultIndex.toString() + formIndex.toString()}
              control={formMethods.control}
              multiline
              placeholderText={resultFieldNamePlaceholderText(result.type)}
              label={``}
              defaultValue=""
            />
          </FieldBlock>
          {(result.type === ResultType.Decision || result.type === ResultType.Ranking) && (
            <FieldOptionsForm
              formMethods={formMethods}
              formIndex={formIndex}
              fieldIndex={resultIndex}
              branch={"response"}
            />
          )}

          <DecisionConfigForm
            formIndex={formIndex}
            formMethods={formMethods}
            resultIndex={resultIndex}
            field={resultField}
            display={result.type === ResultType.Decision}
          />

          <LlmSummaryForm
            formIndex={formIndex}
            formMethods={formMethods}
            resultIndex={resultIndex}
            display={
              result.type === ResultType.LlmSummary || result.type === ResultType.LlmSummaryList
            }
            type={result.type}
          />

          <PrioritizationForm
            formIndex={formIndex}
            formMethods={formMethods}
            resultIndex={resultIndex}
            field={resultField}
            display={result.type === ResultType.Ranking}
          />
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
    </Box>
  );
};
