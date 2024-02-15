import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../../formValidation/flow";
import { Select, TextField } from "../../../FormFields";
import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { useEffect, useState } from "react";
import { defaultStep } from "../../wizardScreens/Setup";
import { ActionNewType } from "@/graphql/generated/graphql";
import { FieldOptionSchemaType } from "../../formValidation/fields";

interface ActionFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  stepsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
}

export const ActionForm = ({ formMethods, formIndex, stepsArrayMethods }: ActionFormProps) => {
  const [latestActionState, setLatestActionState] = useState<ActionNewType>();

  const actionType = formMethods.watch(`steps.${formIndex}.action.type`);

  const options = formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`);

  const defaultOptionSelections = (options ?? []).map((option: FieldOptionSchemaType) => {
    return {
      name: option.name,
      value: option.optionId,
    };
  });

  defaultOptionSelections.unshift({
    name: "Action runs for every result",
    value: "None",
  });

  useEffect(() => {
    if (actionType !== latestActionState) {
      if (actionType === ActionNewType.TriggerStep) {
        stepsArrayMethods.append(defaultStep);
      } else if (latestActionState === ActionNewType.TriggerStep) {
        stepsArrayMethods.remove(formIndex + 1);
      }
      setLatestActionState(actionType);
    }
  }, [actionType]);

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          width="300px"
          name={`steps.${formIndex}.action.type`}
          selectOptions={[
            { name: "No automated action on result", value: ActionNewType.None },
            { name: "Trigger new step on result", value: ActionNewType.TriggerStep },
            { name: "Call a webhook on result", value: ActionNewType.CallWebhook },
          ]}
          label="Action"
          size="small"
          displayLabel={false}
        />
        {(options ?? []).length > 0 && actionType !== ActionNewType.None && (
          <Select<FlowSchemaType>
            control={formMethods.control}
            label="When to run action"
            width="300px"
            renderValue={(val) => {
              const option = options.find((option) => option.optionId === val);
              if (option) {
                return "Only run action on: " + option.name;
              } else return "Run action on all options";
            }}
            selectOptions={defaultOptionSelections}
            displayLabel={false}
            name={`steps.${formIndex}.action.filterOptionId`}
          />
        )}
      </ResponsiveFormRow>
      {actionType === ActionNewType.CallWebhook && (
        <ResponsiveFormRow>
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="300px"
            label="Url"
            variant="standard"
            size="small"
            showLabel={false}
            placeholderText="Webhook Uri (not displayed publicly)"
            name={`steps.${formIndex}.action.callWebhook.uri`}
          />
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="300px"
            label="What does this webhook do?"
            placeholderText="What does this webhook do?"
            variant="standard"
            size="small"
            showLabel={false}
            name={`steps.${formIndex}.action.callWebhook.name`}
          />
        </ResponsiveFormRow>
      )}
    </>
  );
};
