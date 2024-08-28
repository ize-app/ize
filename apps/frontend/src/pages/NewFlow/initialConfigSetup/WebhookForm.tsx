import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { WebhookForm as WebhookURIForm } from "@/components/Form/FlowForm/components/ActionForm/WebhookForm";

import { FieldBlock } from "./FieldBlock";
import { ButtonGroupField } from "../ButtonGroupField";
import { ActionTriggerCondition, IntitialFlowSetupSchemaType } from "../formValidation";

export const WebhookForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const webhookTriggerCondition = watch("webhookTriggerCondition");

  const permissionType = watch("permission.type");

  return (
    <>
      <FieldBlock>
        <Typography variant="description">When should this action happen?</Typography>
        <ButtonGroupField<IntitialFlowSetupSchemaType>
          label="Test"
          name={`webhookTriggerCondition`}
          options={[
            {
              name: "Whenever someone triggers this flow",
              value: ActionTriggerCondition.None,
            },
            {
              name: "Only if there's a certain decision",
              value: ActionTriggerCondition.Decision,
            },
          ]}
        />
      </FieldBlock>
      {webhookTriggerCondition && permissionType && (
        <FieldBlock>
          <Typography variant="description">Let&apos;s set up how this webhook works</Typography>

          <WebhookURIForm<IntitialFlowSetupSchemaType> fieldName={`webhook`} />
        </FieldBlock>
      )}
    </>
  );
};
