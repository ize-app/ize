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
      return "How is a decision reached?";
    case StepType.Prioritize:
      return "How is the prioritization determined?";
    case StepType.GetInput:
      return "How is final output created?";
  }
};

export const ResponsePermissionsForm = ({ formMethods, formIndex }: ResponsePermissionsForm) => {
  const stepType = formMethods.watch(`steps.${formIndex}.respond.inputs.type`);
  const isAgentRespondTrigger =
    formMethods.watch(`steps.${formIndex}.respond.permission.type`) ===
    RespondPermissionType.Agents;

  const decisionType = formMethods.watch(`steps.${formIndex}.result.decision.type`);
  const hasDefaultOption = formMethods.watch(
    `steps.${formIndex}.result.decision.defaultOption.hasDefault`,
  );

  const options = formMethods.watch(`steps.${formIndex}.respond.inputs.options.options`);

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
          <ResponsiveFormRow>
            {stepType === StepType.Decide && (
              <>
                <Select<NewFlowFormFields>
                  control={formMethods.control}
                  label="How do we determine the final result?"
                  width="300px"
                  selectOptions={[
                    {
                      name: "An option gets X # of votes",
                      value: ResultDecisionType.ThresholdVote,
                    },
                    {
                      name: "An option gets X % of votes",
                      value: ResultDecisionType.PercentageVote,
                    },
                  ]}
                  name={`steps.${formIndex}.result.decision.type`}
                />

                {decisionType === ResultDecisionType.ThresholdVote && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="300px"
                    label="Threshold votes"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decision.threshold.decisionThresholdCount`}
                  />
                )}
                {decisionType === ResultDecisionType.PercentageVote && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="300px"
                    label="Option selected with"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decision.percentage.decisionThresholdPercentage`}
                    endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
                  />
                )}
              </>
            )}
          </ResponsiveFormRow>
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
          <ResponsiveFormRow>
            {(options ?? []).length > 1 && stepType === StepType.Decide && (
              <Switch<NewFlowFormFields>
                name={`steps.${formIndex}.result.decision.defaultOption.hasDefault`}
                control={formMethods.control}
                label="Choose default option if no result before expiration"
              />
            )}
            {hasDefaultOption && (
              <Select<NewFlowFormFields>
                control={formMethods.control}
                label="Default option"
                width="300px"
                selectOptions={(options ?? []).map((option) => {
                  console.log("option is ", option);
                  return {
                    name: option.name,
                    value: option.optionId,
                  };
                })}
                name={`steps.${formIndex}.result.decision.defaultOption.optionId`}
              />
            )}
          </ResponsiveFormRow>
          {/* <ResponsiveFormRow></ResponsiveFormRow> */}
        </>
      )}
    </StepComponentContainer>
  );
};
