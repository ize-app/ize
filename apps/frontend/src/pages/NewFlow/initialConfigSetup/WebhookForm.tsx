import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";

import { FieldBlock } from "./FieldBlock";
import { OptionsForm } from "./OptionsForm";
import { ActionTriggerCondition, IntitialFlowSetupSchemaType } from "../formValidation";

export const WebhookForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const webhookName = watch("webhookName");
  const webhookTriggerCondition = watch("webhookTriggerCondition");
  // const options = watch("optionsConfig.options") ?? [];

  // const defaultOption: SelectOption = {
  //   name: "Action runs for every result",
  //   value: DefaultOptionSelection.None,
  // };
  // const filterOptions: SelectOption[] = options.map((option) => ({
  //   name: option.name,
  //   value: option.optionId,
  // }));

  // filterOptions.unshift(defaultOption);

  return (
    <>
      <FieldBlock>
        <Typography variant="description">
          In the next step, you&apos;ll set up this integration with a webhook. What will this
          webhook do?
        </Typography>
        <TextField<IntitialFlowSetupSchemaType>
          // assuming here that results to fields is 1:1 relationshp
          name={`webhookName`}
          multiline
          placeholderText={"Posts tweet on shared Twitter"}
          label={`Webhook name`}
          defaultValue=""
        />
        {/* <WebhookURIForm<IntitialFlowSetupSchemaType> fieldName={`webhook`} /> */}
      </FieldBlock>
      {webhookName && (
        <FieldBlock>
          <Typography variant="description">When should the other tool be triggered?</Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="When should this action happen?"
            name={`webhookTriggerCondition`}
            options={[
              {
                name: "Whenever someone triggers this flow",
                value: ActionTriggerCondition.None,
              },
              {
                name: "Only after a decision",
                value: ActionTriggerCondition.Decision,
              },
            ]}
          />
        </FieldBlock>
      )}
      {webhookTriggerCondition === ActionTriggerCondition.Decision && <OptionsForm />}
      {/* {options.length > 0 && (
        <FieldBlock>
          <Typography variant="description">
            On which decision should the webhook trigger?
          </Typography>
          <Select<IntitialFlowSetupSchemaType>
            label="When to run action"
            renderValue={(val) => {
              if (val === DefaultOptionSelection.None)
                return "Webhook is triggered on every decision";
              const optionName = getSelectOptionName(filterOptions, val);
              if (optionName) {
                return "Only trigger webhook on: " + optionName;
              } else "Webhook is triggered on every decision";
            }}
            selectOptions={filterOptions}
            defaultValue=""
            name={`filterOptionId`}
          />
        </FieldBlock>
      )} */}
    </>
  );
};
