import { UseFormReturn, useFieldArray } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import {
  InputDataType,
  OptionSelectionType,
  StepType,
} from "../types";
import { Select, Switch, TextField } from "../../FormFields";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResponseOptionsForm } from "./ResponseOptionsForm";
import { Button, FormHelperText } from "@mui/material";

interface ResponseInputsFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
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

export const ResponseInputsForm = ({ formMethods, formIndex }: ResponseInputsFormProps) => {
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

  const createOptionSelectionTypeOptions = (stepPurpose: StepType) => {
    const options = [
      {
        name: "Select one",
        value: OptionSelectionType.SingleSelect,
      },
      {
        name: "Rank options",
        value: OptionSelectionType.Rank,
      },
    ];
    if (stepPurpose === StepType.Prioritize)
      options.push({
        name: "Select multiple",
        value: OptionSelectionType.MultiSelect,
      });

    return options;
  };
  const isMultiSelect =
    formMethods.watch(`steps.${formIndex}.respond.inputs.options.selectionType`) ===
    OptionSelectionType.MultiSelect;

  const inputsGlobalError = formMethods.formState?.errors?.steps
    ? formMethods.formState?.errors?.steps[formIndex]?.respond?.inputs?.message
    : "";

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
              <ResponsiveFormRow>
                <>
                  <Select
                    control={formMethods.control}
                    width="300px"
                    name={`steps.${formIndex}.respond.inputs.options.selectionType`}
                    selectOptions={createOptionSelectionTypeOptions(stepType)}
                    label="How do users select options?"
                  />
                  {isMultiSelect && (
                    <TextField<NewFlowFormFields>
                      control={formMethods.control}
                      width="300px"
                      label="How many can they select?"
                      variant="outlined"
                      name={`steps.${formIndex}.respond.inputs.options.maxSelectableOptions`}
                    />
                  )}
                </>
              </ResponsiveFormRow>
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
