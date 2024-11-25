import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";
import { FieldDataType } from "@/graphql/generated/graphql";

import { ActionTriggerCondition, IntitialFlowSetupSchemaType } from "../formValidation";
import { DecisionForm } from "./DecisionForm";

export const WebhookForm = () => {
  const { watch, setValue } = useFormContext<IntitialFlowSetupSchemaType>();

  const webhookName = watch("webhookName");
  const webhookTriggerCondition = watch("webhookTriggerCondition");

  useEffect(() => {
    if (webhookTriggerCondition === ActionTriggerCondition.Decision) {
      console.log("setting options");
      setValue("optionsConfig", {
        options: [
          { optionId: crypto.randomUUID(), name: "✅", dataType: FieldDataType.String },
          { optionId: crypto.randomUUID(), name: "❌", dataType: FieldDataType.String },
        ],
        triggerDefinedOptions: undefined,
        linkedOptions: { hasLinkedOptions: false },
      });
    } else {
      setValue("optionsConfig", undefined);
      setValue("decision", undefined);
      setValue("question", undefined);
    }
  }, [webhookTriggerCondition]);
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
      <FieldBlockFadeIn>
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
      </FieldBlockFadeIn>
      {webhookName && (
        <FieldBlockFadeIn>
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
        </FieldBlockFadeIn>
      )}
      {webhookTriggerCondition === ActionTriggerCondition.Decision && <DecisionForm />}
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
