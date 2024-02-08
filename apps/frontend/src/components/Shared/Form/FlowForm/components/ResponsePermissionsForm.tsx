import { UseFormReturn } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import {
  InputDataType,
  OptionSelectionType,
  OptionsCreationType,
  RequestPermissionType,
  RespondPermissionType,
  ResultDecisionType,
  StepType,
} from "../types";
import {
  Checkbox,
  DatePicker,
  DateTimePicker,
  RoleSearch,
  Select,
  Switch,
  TextField,
} from "../../FormFields";
import { LabeledGroupedInputs } from "./LabeledGroupedInputs";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { InputAdornment } from "@mui/material";

interface ResponsePermissionsForm {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

const getInputStepHeader = (stepType: StepType) => {
  switch (stepType) {
    case StepType.Decide:
      return "Who participates in the decision?";
    case StepType.Prioritize:
      return "Who participates in the prioritization?";
    case StepType.GetInput:
      return "How gets to give input?";
  }
};

export const ResponsePermissionsForm = ({ formMethods, formIndex }: ResponsePermissionsForm) => {
  const stepType = formMethods.watch(`steps.${formIndex}.respond.inputs.type`);
  const isAgentRespondTrigger =
    formMethods.watch(`steps.${formIndex}.respond.permission.type`) ===
    RespondPermissionType.Agents;

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

  return (
    <StepComponentContainer label={getInputStepHeader(stepType)}>
      {stepType && (
        <>
          <ResponsiveFormRow>
            <Select<NewFlowFormFields>
              control={formMethods.control}
              width="300px"
              name={`steps.${formIndex}.respond.permission.type`}
              selectOptions={[
                { name: "Certain individuals and groups", value: RequestPermissionType.Agents },
                { name: "Anyone", value: RequestPermissionType.Anyone },
              ]}
              label="Who can respond?"
            />

            {isAgentRespondTrigger && (
              <RoleSearch<NewFlowFormFields>
                ariaLabel={"Individuals and groups who can respond"}
                name={`steps.${formIndex}.respond.permission.agents`}
                control={formMethods.control}
                setFieldValue={formMethods.setValue}
                getFieldValues={formMethods.getValues}
              />
            )}
          </ResponsiveFormRow>
          {(stepType === StepType.Decide || stepType === StepType.Prioritize) && (
            <ResponsiveFormRow>
              <>
                <Select
                  control={formMethods.control}
                  width="300px"
                  name={`steps.${formIndex}.respond.inputs.options.selectionType`}
                  selectOptions={createOptionSelectionTypeOptions(stepType)}
                  label="How do participants select options?"
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
          )}
          <ResponsiveFormRow>
            <Select<NewFlowFormFields>
              control={formMethods.control}
              label="How long do people have to respond?"
              width="300px"
              selectOptions={[
                { name: "1 hour", value: 3600 },
                { name: "4 hours", value: 14400 },
                { name: "1 day", value: 86400 },
                { name: "3 days", value: 259200 },
                { name: "7 days", value: 604800 },
                { name: "30 days", value: 2592000 },
              ]}
              name={`steps.${formIndex}.result.requestExpirationSeconds`}
            />
            <TextField<NewFlowFormFields>
              control={formMethods.control}
              width="300px"
              label="Minimum # of responses for a result"
              variant="outlined"
              endAdornment={<InputAdornment position="end">total responses</InputAdornment>}
              name={`steps.${formIndex}.result.minimumResponses`}
            />
          </ResponsiveFormRow>
        </>
      )}
    </StepComponentContainer>
  );
};
