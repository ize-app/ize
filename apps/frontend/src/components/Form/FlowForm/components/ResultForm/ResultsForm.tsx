import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FlowSchemaType } from "../../formValidation/flow";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { Select, TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";

import {
  DefaultFieldSelection,
  DefaultOptionSelection,
  FieldsSchemaType,
} from "../../formValidation/fields";
import { DecisionType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { Box, FormHelperText, Typography } from "@mui/material";
import { ResultSchemaType } from "../../formValidation/result";
import { SelectOption } from "../../../formFields/Select";
import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { StepComponentContainer } from "../StepContainer";

export const defaultResult = (stepIndex: number, resultIndex: number): ResultSchemaType => ({
  resultId: "new." + stepIndex + "." + resultIndex,
  type: ResultType.Decision,
  fieldId: DefaultFieldSelection.None,
  minimumAnswers: 1,
  decision: {
    type: DecisionType.NumberThreshold,
    threshold: 1,
    defaultOptionId: DefaultOptionSelection.None,
  },
});

interface ResultsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

const createResultFieldOptions = (
  resultType: ResultType,
  responseFields: FieldsSchemaType,
): SelectOption[] => {
  const defaultSelection: SelectOption = { name: "All fields", value: DefaultFieldSelection.None };

  switch (resultType) {
    case ResultType.Decision: {
      const selectOptions: SelectOption[] = [];
      responseFields.forEach((field, fieldIndex) => {
        if (field.type !== FieldType.Options) return;
        selectOptions.push({
          name: "Field " + (fieldIndex + 1).toString() + ": " + field.name.toString(),
          value: field.fieldId,
        });
      });
      return selectOptions;
    }
    case ResultType.Ranking: {
      const selectOptions: SelectOption[] = [];
      responseFields.forEach((field, fieldIndex) => {
        if (field.type !== FieldType.Options) return;
        selectOptions.push({
          name: "Field " + (fieldIndex + 1).toString() + ": " + field.name.toString(),
          value: field.fieldId,
        });
      });
      return selectOptions;
    }
    case ResultType.LlmSummary: {
      return [defaultSelection];
    }
    default:
      return [];
  }
};

export const ResultsForm = ({ formMethods, formIndex }: ResultsFormProps) => {
  const { watch } = formMethods;

  const { fields, remove, append } = useFieldArray({
    control: formMethods.control,
    //@ts-ignore
    name: `steps.${formIndex}.result`,
  });

  const responseFields = watch(`steps.${formIndex}.response.fields`) ?? [];
  const results = watch(`steps.${formIndex}.result`) ?? [];

  return (
    <StepComponentContainer label={"Result"}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
        {fields.map((item, resultIndex) => {
          const result = formMethods.watch(`steps.${formIndex}.result.${resultIndex}`);

          const resultField = responseFields.find((field) => field.fieldId === result.fieldId);
          const fieldOptions = createResultFieldOptions(result.type, responseFields);
          const resultError =
            formMethods.getFieldState(`steps.${formIndex}.result.${resultIndex}`).error?.root
              ?.message ?? "";

          return (
            <LabeledGroupedInputs label={"Result " + (resultIndex + 1).toString()} key={item.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "space-between",
                  backgroundColor: "#edfbff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: "12px",
                    width: "100%",
                  }}
                >
                  <ResponsiveFormRow>
                    <Box sx={{ display: "none" }}>
                      <TextField<FlowSchemaType>
                        //@ts-ignore
                        name={`steps.${formIndex}.result.${resultIndex}.resultId`}
                        key={"resultId" + resultIndex.toString() + formIndex.toString()}
                        control={formMethods.control}
                        showLabel={false}
                        label={`Option ID - ignore`}
                        variant="standard"
                        disabled={true}
                        size="small"
                      />
                    </Box>
                    <Select<FlowSchemaType>
                      control={formMethods.control}
                      label="What's the final result?"
                      width="140px"
                      selectOptions={[
                        { name: "Decision", value: ResultType.Decision },
                        { name: "Prioritized options", value: ResultType.Ranking },
                        { name: "AI summary", value: ResultType.LlmSummary },
                      ]}
                      name={`steps.${formIndex}.result.${resultIndex}.type`}
                      size="small"
                      displayLabel={false}
                    />
                    {fieldOptions.length > 0 ? (
                      <Select<FlowSchemaType>
                        control={formMethods.control}
                        label="Field"
                        width="300px"
                        flexGrow={"1"}
                        selectOptions={fieldOptions}
                        name={`steps.${formIndex}.result.${resultIndex}.fieldId`}
                        size="small"
                        displayLabel={false}
                      />
                    ) : (
                      <Typography>
                        To make a decision result, first add a response options field.
                      </Typography>
                    )}
                  </ResponsiveFormRow>
                  {result.type === ResultType.Decision && resultField && (
                    <DecisionConfigForm
                      formIndex={formIndex}
                      formMethods={formMethods}
                      resultIndex={resultIndex}
                      resultId={result.resultId}
                      field={resultField}
                    />
                  )}
                  {result.type === ResultType.LlmSummary && (
                    <LlmSummaryForm
                      formIndex={formIndex}
                      formMethods={formMethods}
                      resultIndex={resultIndex}
                      resultId={result.resultId}
                    />
                  )}
                </Box>
                <IconButton
                  color="primary"
                  aria-label="Remove option"
                  onClick={() => remove(resultIndex)}
                >
                  <HighlightOffOutlined />
                </IconButton>
                <FormHelperText
                  sx={{
                    color: "error.main",
                    marginLeft: "16px",
                  }}
                >
                  {resultError}
                </FormHelperText>
              </Box>
            </LabeledGroupedInputs>
          );
        })}
        <Button
          sx={{ position: "relative", bottom: "8px", width: "140px" }}
          variant="outlined"
          onClick={() => {
            append(defaultResult(formIndex, results.length));
          }}
        >
          Add result
        </Button>
      </Box>
    </StepComponentContainer>
  );
};

//   }
