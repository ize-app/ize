import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import {
  InputDataType,
  OptionSelectionType,
  OptionsCreationType,
  RespondPermissionType,
  StepType,
} from "../types";
import { Select, TextField } from "../../FormFields";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResponseOptionsForm } from "./ResponseOptionsForm";

interface ResponseInputsFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  responseOptionsFormMethods: UseFieldArrayReturn<NewFlowFormFields>;
}

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
  responseOptionsFormMethods,
}: ResponseInputsFormProps) => {
  const stepType = formMethods.watch(`steps.${formIndex}.respond.inputs.type`);
  const isMultiSelect =
    formMethods.watch(`steps.${formIndex}.respond.inputs.options.selectionType`) ===
    OptionSelectionType.MultiSelect;
  const optionCreationType = formMethods.watch(
    `steps.${formIndex}.respond.inputs.options.creationType`,
  );
  const isAgentRespondTrigger =
    formMethods.watch(`steps.${formIndex}.respond.permission.type`) ===
    RespondPermissionType.Agents;
  return (
    <StepComponentContainer label={getInputStepHeader(stepType)}>
      {stepType && (
        <>
          <ResponsiveFormRow>
            {[StepType.GetInput].includes(stepType) && (
              <>
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
              </>
            )}
            {[StepType.Decide, StepType.Prioritize].includes(stepType) && (
              <>
                <Select
                  control={formMethods.control}
                  width="300px"
                  name={`steps.${formIndex}.respond.inputs.options.creationType`}
                  selectOptions={[
                    {
                      name: "Same options for every request",
                      value: OptionsCreationType.ProcessDefinedOptions,
                    },
                    {
                      name: "Requestor creates their own options",
                      value: OptionsCreationType.RequestDefinedOptions,
                    },
                  ]}
                  label="Who defines the options?"
                />
                <Select
                  control={formMethods.control}
                  width="200px"
                  name={`steps.${formIndex}.respond.inputs.options.selectionType`}
                  selectOptions={createOptionSelectionTypeOptions(stepType)}
                  label="How do users select options?"
                />
                {isMultiSelect && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="200px"
                    label="How many can they select?"
                    variant="outlined"
                    name={`steps.${formIndex}.respond.inputs.options.maxSelectableOptions`}
                  />
                )}
                {optionCreationType === OptionsCreationType.ProcessDefinedOptions && (
                  <ResponseOptionsForm
                    useFormMethods={formMethods}
                    //@ts-ignore Not sure why the TS error - types are the same
                    responseOptionsFormMethods={responseOptionsFormMethods}
                    formIndex={formIndex}
                  />
                )}
                {optionCreationType === OptionsCreationType.RequestDefinedOptions && (
                  <Select
                    control={formMethods.control}
                    width="150px"
                    name={`steps.${formIndex}.respond.inputs.options.dataType`}
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
              </>
            )}
          </ResponsiveFormRow>
        </>
      )}
    </StepComponentContainer>
  );
};
