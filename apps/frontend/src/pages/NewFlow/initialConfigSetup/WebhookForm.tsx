import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { WebhookForm as WebhookURIForm } from "@/components/Form/FlowForm/components/ActionForm/WebhookForm";
import { DefaultOptionSelection } from "@/components/Form/FlowForm/formValidation/fields";
import { Select } from "@/components/Form/formFields";
import { SelectOption } from "@/components/Form/formFields/Select";
import { getSelectOptionName } from "@/components/Form/utils/getSelectOptionName";

import { FieldBlock } from "./FieldBlock";
import { OptionsForm } from "./OptionsForm";
import { ButtonGroupField } from "../ButtonGroupField";
import { ActionTriggerCondition, IntitialFlowSetupSchemaType } from "../formValidation";

export const WebhookForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const webhookTriggerCondition = watch("webhookTriggerCondition");
  const options = watch("optionsConfig.options");

  const defaultOption: SelectOption = {
    name: "Action runs for every result",
    value: DefaultOptionSelection.None,
  };
  const filterOptions: SelectOption[] = options.map((option) => ({
    name: option.name,
    value: option.optionId,
  }));

  filterOptions.unshift(defaultOption);

  return (
    <>
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
      {webhookTriggerCondition && <OptionsForm />}
      {webhookTriggerCondition && (
        <FieldBlock>
          <Typography variant="description">Let&apos;s set up how this webhook works</Typography>

          <WebhookURIForm<IntitialFlowSetupSchemaType> fieldName={`webhook`} />
        </FieldBlock>
      )}
      {options.length > 0 && (
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
      )}
    </>
  );
};
