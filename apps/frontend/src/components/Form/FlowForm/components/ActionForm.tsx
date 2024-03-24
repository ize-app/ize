import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select, TextField } from "../../formFields";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { useEffect, useState } from "react";

import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { ActionNewType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "../formValidation/fields";
import { SelectOption } from "../../formFields/Select";
import { StepComponentContainer } from "./StepContainer";
import { getSelectOptionName } from "../../utils/getSelectOptionName";

interface ActionFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  stepsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
}

export const ActionForm = ({ formMethods, formIndex, stepsArrayMethods }: ActionFormProps) => {
  const [latestActionState, setLatestActionState] = useState<ActionNewType>();

  const actionType = formMethods.watch(`steps.${formIndex}.action.type`);

  // const options = formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`);
  const results = formMethods.watch(`steps.${formIndex}.result`);
  const responseFields = formMethods.watch(`steps.${formIndex}.response.fields`);

  const options: SelectOption[] = [];

  (results ?? [])
    .filter((res) => res.type === ResultType.Decision)
    .forEach((res, resIndex) => {
      const field = responseFields.find((f) => f.fieldId === res.fieldId);
      if (!field || field.type !== FieldType.Options) return;
      field.optionsConfig.options.map((o) => {
        options.push({
          name: `Result ${resIndex}: "${o.name}"`,
          value: o.optionId,
        });
      });
    });

  const defaultOptionSelections: SelectOption[] = [...options];

  defaultOptionSelections.unshift({
    name: "Action runs for every result",
    value: DefaultOptionSelection.None,
  });

  const stepCount = formMethods.watch("steps").length;

  useEffect(() => {
    if (actionType !== latestActionState) {
      if (actionType === ActionNewType.TriggerStep) {
        stepsArrayMethods.append(defaultStepFormValues);
      } else if (latestActionState === ActionNewType.TriggerStep) {
        for (let i = 0; i < stepCount; i++) {
          stepsArrayMethods.remove(formIndex + 1);
        }
      }
      setLatestActionState(actionType);
    }
  }, [actionType]);

  return (
    <StepComponentContainer label={"Action"}>
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
          <>
            <Select<FlowSchemaType>
              control={formMethods.control}
              label="When to run action"
              width="300px"
              renderValue={(val) => {
                const optionName = getSelectOptionName(options, val);
                if (optionName) {
                  return "Only run action on: " + optionName;
                } else return "Run action on all options";
              }}
              flexGrow="1"
              selectOptions={defaultOptionSelections}
              displayLabel={false}
              name={`steps.${formIndex}.action.filterOptionId`}
            />
          </>
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
            flexGrow="1"
            size="small"
            showLabel={false}
            name={`steps.${formIndex}.action.callWebhook.name`}
          />
        </ResponsiveFormRow>
      )}
    </StepComponentContainer>
  );
};
