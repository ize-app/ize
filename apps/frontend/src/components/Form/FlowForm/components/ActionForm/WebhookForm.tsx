import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { ActionType } from "@/graphql/generated/graphql";

import { TextField } from "../../../formFields";
import { WebhookField } from "../../../formFields/WebhookField/WebhookField";
import { FlowSchemaType } from "../../formValidation/flow";

interface WebhookFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const WebhookForm = ({ formMethods, formIndex }: WebhookFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.action.type`, ActionType.CallWebhook);
    formMethods.setValue(`steps.${formIndex}.action.callWebhook.webhookId`, "webhook" + formIndex);
    // formMethods.setValue(`steps.${formIndex}.action.filterOptionId`, DefaultOptionSelection.None);
  }, []);

  return (
    <>
      <TextField<FlowSchemaType>
        control={formMethods.control}
        label="What does this webhook do?"
        placeholderText="What does this webhook do?"
        size="small"
        showLabel={false}
        name={`steps.${formIndex}.action.callWebhook.name`}
      />
      <WebhookField
        formMethods={formMethods}
        name={`steps.${formIndex}.action.callWebhook`}
        type="result"
      />
    </>
  );
};
