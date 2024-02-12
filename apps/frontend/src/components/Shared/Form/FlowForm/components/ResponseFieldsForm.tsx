import { UseFormReturn, useFieldArray } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { InputDataType, OptionSelectionType, PreviousStepResult, StepType } from "../types";
import { Select, Switch, TextField } from "../../FormFields";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResponseOptionsForm, defaultOption } from "./ResponseOptionsForm";
import { Box, Button, FormHelperText } from "@mui/material";
import { FieldType } from "@/graphql/generated/graphql";
import { useEffect } from "react";

interface ResponseFieldsFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  previousStepResult: PreviousStepResult | null;
  stepType: StepType;
}

const getInputStepHeader = (stepType: StepType) => {
  switch (stepType) {
    case StepType.Decide:
      return "What options are being decided on?";
    case StepType.Prioritize:
      return "What options are being prioritized?";
    case StepType.GetInput:
      return "What kind of information are you asking for?";
  }
};

export const ResponseFieldsForm = ({
  formMethods,
  formIndex,
  previousStepResult,
  stepType,
}: ResponseFieldsFormProps) => {
  const responseOptionsFormMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.response.field.optionsConfig.options`,
  });

  formMethods.setValue(`steps.${formIndex}.response.field.type`, FieldType.FreeInput);

  const stepDefinedOptions =
    formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`) ?? [];

  const hasRequestDefinedOptions = formMethods.watch(
    `steps.${formIndex}.response.field.optionsConfig.hasRequestOptions`,
  );

  const inputsGlobalError = formMethods.formState?.errors?.steps
    ? formMethods.formState?.errors?.steps[formIndex]?.response?.field?.message
    : "";

  useEffect(() => {
    if (stepType === StepType.GetInput)
      formMethods.setValue(`steps.${formIndex}.response.field.type`, FieldType.FreeInput);
    else formMethods.setValue(`steps.${formIndex}.response.field.type`, FieldType.Options);
  }, [stepType]);

  console.log("previous step", previousStepResult);

  return (
    <StepComponentContainer label={getInputStepHeader(stepType)}>
      {stepType && (
        <>
          <Box sx={{ display: "none" }}>
            <TextField<NewFlowFormFields>
              name={`steps.${formIndex}.response.field.fieldId`}
              control={formMethods.control}
              label={`Field ID`}
              variant="outlined"
              disabled={true}
            />
            <TextField<NewFlowFormFields>
              name={`steps.${formIndex}.response.field.name`}
              control={formMethods.control}
              label={`Field ID`}
              variant="outlined"
              disabled={true}
            />
          </Box>
          {[StepType.GetInput].includes(stepType) && (
            <ResponsiveFormRow>
              <Select
                control={formMethods.control}
                width="300px"
                name={`steps.${formIndex}.response.field.freeInputDataType`}
                selectOptions={[
                  { name: "Text", value: InputDataType.String },
                  { name: "Number", value: InputDataType.Number },
                  { name: "Uri", value: InputDataType.Uri },
                  { name: "Date", value: InputDataType.Date },
                  { name: "Date + Time", value: InputDataType.DateTime },
                ]}
                label="What type of input?"
              />
            </ResponsiveFormRow>
          )}
          {[StepType.Decide, StepType.Prioritize].includes(stepType) && (
            <>
              {previousStepResult && !previousStepResult.isAiSummary && (
                <ResponsiveFormRow>
                  <Switch<NewFlowFormFields>
                    name={`steps.${formIndex}.response.field.optionsConfig.previousStepOptions`}
                    control={formMethods.control}
                    width="100%"
                    label={(() => {
                      switch (previousStepResult.stepType) {
                        case StepType.Decide:
                          return `Use decision from last step, ${
                            previousStepResult.stepName
                              ? previousStepResult.stepName
                              : "Step " + formIndex
                          }, as option in this step`;
                        case StepType.GetInput:
                          return `Use responses from last step, ${
                            previousStepResult.stepName
                              ? previousStepResult.stepName
                              : "Step " + formIndex
                          }, as options in this step`;
                        case StepType.Prioritize:
                          return `Use prioritized options from last step, ${
                            previousStepResult.stepName
                              ? previousStepResult.stepName
                              : "Step " + formIndex
                          }, as options in this step`;
                        default:
                          return "Use result from last step as options";
                      }
                    })()}
                  />
                </ResponsiveFormRow>
              )}
              {formIndex === 0 && (
                <ResponsiveFormRow>
                  <Switch<NewFlowFormFields>
                    name={`steps.${formIndex}.response.field.optionsConfig.hasRequestOptions`}
                    control={formMethods.control}
                    label="Requestor defines options"
                  />
                  {hasRequestDefinedOptions && (
                    <Select
                      control={formMethods.control}
                      width="150px"
                      name={`steps.${formIndex}.response.field.optionsConfig.requestOptionsDataType`}
                      selectOptions={[
                        { name: "Text", value: InputDataType.String },
                        { name: "Number", value: InputDataType.Number },
                        { name: "Uri", value: InputDataType.Uri },
                        { name: "Date", value: InputDataType.Date },
                        { name: "DateTime", value: InputDataType.DateTime },
                      ]}
                      label="Option type"
                    />
                  )}
                </ResponsiveFormRow>
              )}
              <ResponsiveFormRow>
                {stepDefinedOptions.length > 0 ? (
                  <ResponseOptionsForm
                    useFormMethods={formMethods}
                    //@ts-ignore Not sure why the TS error - types are the same
                    responseOptionsFormMethods={responseOptionsFormMethods}
                    formIndex={formIndex}
                  />
                ) : (
                  <Button
                    variant={"outlined"}
                    onClick={() => {
                      responseOptionsFormMethods.append(defaultOption);
                    }}
                  >
                    Add options that will be on every request
                  </Button>
                )}
              </ResponsiveFormRow>
            </>
          )}
        </>
      )}
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
