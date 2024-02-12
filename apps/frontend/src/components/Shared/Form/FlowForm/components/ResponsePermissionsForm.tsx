import { UseFormReturn } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import {
  InputDataType,
  OptionSelectionType,
  OptionsCreationType,
  PermissionType,
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
import { FieldOptionsSelectionType } from "@/graphql/generated/graphql";

interface ResponsePermissionsForm {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  stepType: StepType;
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

export const ResponsePermissionsForm = ({
  formMethods,
  formIndex,
  stepType,
}: ResponsePermissionsForm) => {
  const isEntitiesRespondTrigger =
    formMethods.watch(`steps.${formIndex}.response.permission.type`) === PermissionType.Entities;

  const createOptionSelectionTypeOptions = (
    stepPurpose: StepType,
  ): { name: string; value: FieldOptionsSelectionType }[] => {
    const options = [
      {
        name: "Select one",
        value: FieldOptionsSelectionType.Select,
      },
      {
        name: "Rank options",
        value: FieldOptionsSelectionType.Rank,
      },
    ];
    if (stepPurpose === StepType.Prioritize)
      options.push({
        name: "Select multiple",
        value: FieldOptionsSelectionType.MultiSelect,
      });

    return options;
  };
  const isMultiSelect =
    formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.selectionType`) ===
    FieldOptionsSelectionType.MultiSelect;

  return (
    <StepComponentContainer label={getInputStepHeader(stepType)}>
      {stepType && (
        <>
          <ResponsiveFormRow>
            <Select<NewFlowFormFields>
              control={formMethods.control}
              width="300px"
              name={`steps.${formIndex}.response.permission.type`}
              selectOptions={[
                { name: "Certain individuals and groups", value: PermissionType.Entities },
                { name: "Anyone", value: PermissionType.Anyone },
              ]}
              label="Who can respond?"
            />

            {isEntitiesRespondTrigger && (
              <RoleSearch<NewFlowFormFields>
                key="responseRoleSearch"
                ariaLabel={"Individuals and groups who can respond"}
                name={`steps.${formIndex}.response.permission.entities`}
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
                  name={`steps.${formIndex}.response.field.optionsConfig.selectionType`}
                  selectOptions={createOptionSelectionTypeOptions(stepType)}
                  label="How do participants select options?"
                />
                {isMultiSelect && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="300px"
                    label="How many can they select?"
                    variant="outlined"
                    name={`steps.${formIndex}.response.field.optionsConfig.maxSelections`}
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
