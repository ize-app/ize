import { UseFormReturn, useFieldArray } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { InputDataType, OptionSelectionType, PreviousStepResult, StepType } from "../types";
import { Select, Switch, TextField } from "../../FormFields";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResponseOptionsForm } from "./ResponseOptionsForm";
import { Button, FormHelperText } from "@mui/material";

interface ResponseInputsFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  previousStepResult: PreviousStepResult | null;
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

export const ResponseInputsForm = ({
  formMethods,
  formIndex,
  previousStepResult,
}: ResponseInputsFormProps) => {
  const responseOptionsFormMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.respond.inputs.options.stepOptions`,
  });

  const stepType = formMethods.watch(`steps.${formIndex}.respond.inputs.type`);

  const stepDefinedOptions =
    formMethods.watch(`steps.${formIndex}.respond.inputs.options.stepOptions`) ?? [];

  const hasRequestDefinedOptions = formMethods.watch(
    `steps.${formIndex}.respond.inputs.options.requestOptions.requestCanCreateOptions`,
  );

  const inputsGlobalError = formMethods.formState?.errors?.steps
    ? formMethods.formState?.errors?.steps[formIndex]?.respond?.inputs?.message
    : "";

  console.log("previous step", previousStepResult);

  return (
    <StepComponentContainer label={getInputStepHeader(stepType)}>
      {stepType && (
        <>
          {[StepType.GetInput].includes(stepType) && (
            <ResponsiveFormRow>
              <Select
                control={formMethods.control}
                width="300px"
                name={`steps.${formIndex}.respond.inputs.freeInput.dataType`}
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
                    name={`steps.${formIndex}.respond.inputs.options.previousStepOptions`}
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
                    name={`steps.${formIndex}.respond.inputs.options.requestOptions.requestCanCreateOptions`}
                    control={formMethods.control}
                    label="Requestor defines options"
                  />
                  {hasRequestDefinedOptions && (
                    <Select
                      control={formMethods.control}
                      width="150px"
                      name={`steps.${formIndex}.respond.inputs.options.requestOptions.dataType`}
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
                      responseOptionsFormMethods.append({
                        optionId: "newOption." + stepDefinedOptions.length,
                        name: "",
                        dataType: InputDataType.String,
                      });
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
