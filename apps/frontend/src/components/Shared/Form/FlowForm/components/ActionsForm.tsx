import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { ActionType } from "../types";
import { Select, Switch, TextField } from "../../FormFields";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { defaultStep } from "../wizardScreens/Setup";

interface ActionsFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  stepsArrayMethods: UseFieldArrayReturn<NewFlowFormFields>;
}

export const ActionsForm = ({ formMethods, formIndex, stepsArrayMethods }: ActionsFormProps) => {
  const [latestActionState, setLatestActionState] = useState<ActionType>();

  const stepType = formMethods.watch(`steps.${formIndex}.respond.inputs.type`);
  const actionType = formMethods.watch(`steps.${formIndex}.actions.type`);
  const options = formMethods.watch(`steps.${formIndex}.respond.inputs.options.stepOptions`);
  const actionAllOptions = formMethods.watch(`steps.${formIndex}.actions.filter.allOptions`);

  useEffect(() => {
    if (actionType !== latestActionState) {
      if (actionType === ActionType.TriggerStep) {
        stepsArrayMethods.append(defaultStep);
      } else if (latestActionState === ActionType.TriggerStep) {
        console.log("inside remove action", formIndex, latestActionState);
        stepsArrayMethods.remove(formIndex + 1);
      }
      setLatestActionState(actionType);
    }
  }, [actionType]);

  return (
    stepType && (
      <StepComponentContainer label={"What happens next?"}>
        <>
          <ResponsiveFormRow>
            <Select<NewFlowFormFields>
              control={formMethods.control}
              width="300px"
              name={`steps.${formIndex}.actions.type`}
              selectOptions={[
                { name: "Do nothing", value: ActionType.None },
                { name: "Trigger a new step", value: ActionType.TriggerStep },
                { name: "Call a webhook", value: ActionType.CallWebhook },
              ]}
              label="Action"
            />
          </ResponsiveFormRow>
          {actionType === ActionType.CallWebhook && (
            <ResponsiveFormRow>
              <TextField<NewFlowFormFields>
                control={formMethods.control}
                width="300px"
                label="Url"
                variant="outlined"
                name={`steps.${formIndex}.actions.callWebhook.uri`}
              />
              <TextField<NewFlowFormFields>
                control={formMethods.control}
                width="300px"
                label="What does this webhook do?"
                placeholderText="e.g. 'Creates invite on shared calendar'"
                variant="outlined"
                name={`steps.${formIndex}.actions.callWebhook.name`}
              />
            </ResponsiveFormRow>
          )}
          {actionType !== ActionType.None && (options ?? []).length > 0 && (
            <ResponsiveFormRow>
              <Switch<NewFlowFormFields>
                name={`steps.${formIndex}.actions.filter.allOptions`}
                control={formMethods.control}
                label="Run action on every result"
              />
              {!actionAllOptions && (
                <Select<NewFlowFormFields>
                  control={formMethods.control}
                  width="300px"
                  name={`steps.${formIndex}.actions.filter.optionId`}
                  selectOptions={(options ?? []).map((option) => {
                    return {
                      name: option.name,
                      value: option.optionId,
                    };
                  })}
                  label="Only run action on this option"
                />
              )}
            </ResponsiveFormRow>
          )}
        </>
      </StepComponentContainer>
    )
  );
};
