import { UseFormReturn, useFieldArray } from "react-hook-form";

import { FlowSchemaType } from "../../formValidation/flow";
import { Select, TextField } from "../../../FormFields";
import { StepComponentContainer } from "../StepContainer";
import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { ResponseOptionsForm, defaultOption } from "./ResponseOptionsForm";
import { Box, Button, FormHelperText, InputAdornment } from "@mui/material";
import {
  FieldType,
  FieldDataType,
  ResultType,
  FieldOptionsSelectionType,
} from "@/graphql/generated/graphql";
import { useEffect } from "react";
import { PreviousStepResult } from "../StepForm";
import { ResponsePermissionsForm } from "./ResponsePermissionsForm";

interface ResponseFieldsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  previousStepResult: PreviousStepResult | null;
}

const createOptionSelectionTypeOptions = (
  stepPurpose: ResultType,
): { name: string; value: FieldOptionsSelectionType }[] => {
  const options = [
    {
      name: "Select one option",
      value: FieldOptionsSelectionType.Select,
    },
    {
      name: "Rank options",
      value: FieldOptionsSelectionType.Rank,
    },
  ];
  if (stepPurpose === ResultType.Ranking || stepPurpose === ResultType.Raw)
    options.push({
      name: "Select multiple",
      value: FieldOptionsSelectionType.MultiSelect,
    });

  return options;
};

export const ResponseForm = ({
  formMethods,
  formIndex,
  previousStepResult,
}: ResponseFieldsFormProps) => {
  const responseOptionsFormMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.response.field.optionsConfig.options`,
  });

  const stepDefinedOptions =
    formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`) ?? [];
  const requestDefinedOptions = formMethods.watch(
    `steps.${formIndex}.response.field.optionsConfig.hasRequestOptions`,
  );

  const resultType = formMethods.watch(`steps.${formIndex}.result.type`);
  const fieldType = formMethods.watch(`steps.${formIndex}.response.field.type`);
  const isMultiSelect =
    formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.selectionType`) ===
    FieldOptionsSelectionType.MultiSelect;

  const inputsGlobalError = formMethods.formState?.errors?.steps
    ? formMethods.formState?.errors?.steps[formIndex]?.response?.field?.message
    : "";

  useEffect(() => {
    if (resultType === ResultType.Decision || resultType === ResultType.Ranking)
      formMethods.setValue(`steps.${formIndex}.response.field.type`, FieldType.Options);
  }, [resultType]);

  return (
    <StepComponentContainer label={"Response"}>
      <>
        <Box sx={{ display: "none" }}>
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.response.field.fieldId`}
            control={formMethods.control}
            label={`Field ID`}
            variant="outlined"
            disabled={true}
          />
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.response.field.name`}
            control={formMethods.control}
            label={`Field ID`}
            variant="outlined"
            disabled={true}
          />
        </Box>
        <ResponsePermissionsForm formIndex={formIndex} formMethods={formMethods} />
        <ResponsiveFormRow>
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.response.field.name`}
            control={formMethods.control}
            placeholderText={`Describe how you want respondants to respond`}
            label={`Question prompt`}
            multiline={true}
            width="650px"
            startAdornment={<InputAdornment position="start">Prompt</InputAdornment>}
          />
        </ResponsiveFormRow>

        <ResponsiveFormRow>
          <Select
            control={formMethods.control}
            width="300px"
            name={`steps.${formIndex}.response.field.type`}
            selectOptions={[
              { name: "Free input", value: FieldType.FreeInput },
              { name: "Choose from set options", value: FieldType.Options },
            ]}
            disabled={resultType === ResultType.Decision || resultType === ResultType.Ranking}
            label="How do they respond?"
          />
          {fieldType === FieldType.Options && (
            <>
              <Select
                control={formMethods.control}
                width="300px"
                name={`steps.${formIndex}.response.field.optionsConfig.selectionType`}
                selectOptions={createOptionSelectionTypeOptions(resultType)}
                label="How do participants select options?"
              />
              {isMultiSelect && (
                <TextField<FlowSchemaType>
                  control={formMethods.control}
                  width="300px"
                  label="How many can they select?"
                  variant="standard"
                  showLabel={false}
                  name={`steps.${formIndex}.response.field.optionsConfig.maxSelections`}
                />
              )}
            </>
          )}
          {fieldType === FieldType.FreeInput && (
            <Select
              control={formMethods.control}
              width="300px"
              name={`steps.${formIndex}.response.field.freeInputDataType`}
              selectOptions={[
                { name: "Text", value: FieldDataType.String },
                { name: "Number", value: FieldDataType.Number },
                { name: "Uri", value: FieldDataType.Uri },
                { name: "Date", value: FieldDataType.Date },
                { name: "Date + Time", value: FieldDataType.DateTime },
              ]}
              label="What type of input?"
            />
          )}
        </ResponsiveFormRow>
        {fieldType === FieldType.Options && (
          <ResponsiveFormRow>
            {stepDefinedOptions.length > 0 || requestDefinedOptions ? (
              <ResponseOptionsForm
                formMethods={formMethods}
                //@ts-ignore Not sure why the TS error - types are the same
                responseOptionsFormMethods={responseOptionsFormMethods}
                formIndex={formIndex}
                previousStepResult={previousStepResult}
              />
            ) : (
              <Button
                variant={"outlined"}
                onClick={() => {
                  responseOptionsFormMethods.append(defaultOption(stepDefinedOptions.length));
                }}
              >
                Add options
              </Button>
            )}
          </ResponsiveFormRow>
        )}
      </>
      <FormHelperText
        sx={{
          color: "error.main",
        }}
      >
        {inputsGlobalError}
      </FormHelperText>
    </StepComponentContainer>
  );
};
