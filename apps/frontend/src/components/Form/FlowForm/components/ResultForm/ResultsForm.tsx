import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FlowSchemaType } from "../../formValidation/flow";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { Select, TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";

import { DefaultFieldSelection, DefaultOptionSelection } from "../../formValidation/fields";
import { DecisionType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { Box, FormHelperText } from "@mui/material";
import { ResultSchemaType } from "../../formValidation/result";
import { DecisionConfigForm } from "./DecisionConfigForm";
import { LlmSummaryForm } from "./LlmSummaryForm";
import { PrioritizationForm } from "./PrioritizationForm";
import { FieldOptionsForm } from "../FieldOptionsForm";
import Close from "@mui/icons-material/Close";
import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { defaultField } from "../FieldsForm";

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

const resultFieldNamePlaceholderText = (resultType: ResultType) => {
  switch (resultType) {
    case ResultType.Decision:
      return "What are you deciding on?";
    case ResultType.Ranking:
      return "Describe what you're trying to rank";
    case ResultType.LlmSummary:
      return "What's your question?";
    default:
      return "What's your question?";
  }
};

interface ResultsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const ResultsForm = ({ formMethods, formIndex }: ResultsFormProps) => {
  const { watch } = formMethods;

  const { fields, remove, append } = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.result`,
  });

  // const { remove: removeResponseField, append: appendResponseField } = useFieldArray({
  //   control: formMethods.control,
  //   name: `steps.${formIndex}.response.fields`,
  // });

  const results = watch(`steps.${formIndex}.result`) ?? [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {fields.map((item, resultIndex) => {
        const result = formMethods.watch(`steps.${formIndex}.result.${resultIndex}`);
        const resultField = watch(`steps.${formIndex}.response.fields.${resultIndex}`);

        // const resultField = responseFields.find((field) => field.fieldId === result.fieldId);
        // const fieldOptions = createResultFieldOptions(result.type, responseFields);
        const resultError =
          formMethods.getFieldState(`steps.${formIndex}.result.${resultIndex}`).error?.root
            ?.message ?? "";

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "space-between",
            }}
          >
            <LabeledGroupedInputs key={item.id}>
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
                    label={`Option ID - ignore`}
                    variant="standard"
                    disabled={true}
                    size="small"
                  />
                  <TextField<FlowSchemaType>
                    name={`steps.${formIndex}.response.fields.${resultIndex}.fieldId`}
                    key={"fieldId" + resultIndex.toString() + formIndex.toString()}
                    control={formMethods.control}
                    label="fieldId"
                    disabled={true}
                  />
                  <Select<FlowSchemaType>
                    control={formMethods.control}
                    displayLabel={false}
                    size={"small"}
                    disabled={true}
                    name={`steps.${formIndex}.response.fields.${resultIndex}.type`}
                    key={"fieldType" + resultIndex.toString() + formIndex.toString()}
                    selectOptions={[
                      { name: "Free input", value: FieldType.FreeInput },
                      { name: "Options", value: FieldType.Options },
                    ]}
                    label="Type"
                  />
                </Box>
                <FieldBlock>
                  <Select<FlowSchemaType>
                    control={formMethods.control}
                    label="What's the final result?"
                    selectOptions={[
                      { name: "Decision", value: ResultType.Decision },
                      { name: "Ranked list", value: ResultType.Ranking },
                      { name: "AI summary", value: ResultType.LlmSummary },
                    ]}
                    name={`steps.${formIndex}.result.${resultIndex}.type`}
                    size="small"
                    displayLabel={false}
                  />
                  <TextField<FlowSchemaType>
                    // assuming here that results to fields is 1:1 relationshp
                    name={`steps.${formIndex}.response.fields.${resultIndex}.name`}
                    key={"fieldName" + resultIndex.toString() + formIndex.toString()}
                    control={formMethods.control}
                    multiline
                    placeholderText={resultFieldNamePlaceholderText(result.type)}
                    label={``}
                  />
                </FieldBlock>
                {(result.type === ResultType.Decision || result.type === ResultType.Ranking) && (
                  <FieldOptionsForm
                    formMethods={formMethods}
                    formIndex={formIndex}
                    fieldIndex={resultIndex} // double check
                    branch={"response"}
                  />
                )}
                {result.type === ResultType.Decision && resultField && (
                  <DecisionConfigForm
                    formIndex={formIndex}
                    formMethods={formMethods}
                    resultIndex={resultIndex}
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
                {result.type === ResultType.Ranking && resultField && (
                  <PrioritizationForm
                    formIndex={formIndex}
                    formMethods={formMethods}
                    resultIndex={resultIndex}
                    field={resultField}
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
            <IconButton
              color="primary"
              size="small"
              aria-label="Remove result"
              onClick={() => remove(resultIndex)}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        );
      })}
      <Box>
        <Button
          sx={{ flexGrow: 0 }}
          variant="outlined"
          size="small"
          onClick={() => {
            // appendResponseField(defaultField(formIndex, results.length));
            append(defaultResult(formIndex, results.length));
          }}
        >
          Add result
        </Button>
      </Box>
    </Box>
  );
};

//   }
