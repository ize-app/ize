import { useEffect } from "react";
import { FieldPath, FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

import { ActionType } from "@/graphql/generated/graphql";

import { TextField } from "../../../formFields";
import { WebhookField } from "../../../formFields/WebhookField/WebhookField";

interface WebhookFormProps<T extends FieldValues> {
  // formMethods: UseFormReturn<FlowSchemaType>;
  // formIndex: number; // react-hook-form name
  fieldName: FieldPath<T>; // The path to the webhook field in the form schema
}

export const WebhookForm = <T extends FieldValues>({ fieldName }: WebhookFormProps<T>) => {
  const formMethods = useFormContext<T>();
  useEffect(() => {
    formMethods.setValue(
      `${fieldName}.type` as Path<T>,
      ActionType.CallWebhook as PathValue<T, typeof fieldName>,
    );
    // formMethods.setValue(`steps.${formIndex}.action.callWebhook.webhookId`, "webhook" + formIndex);
    // formMethods.setValue(`steps.${formIndex}.action.filterOptionId`, DefaultOptionSelection.None);
  }, []);

  return (
    <>
      <TextField<T>
        control={formMethods.control}
        label="What does this webhook do?"
        placeholderText="What does this webhook do?"
        size="small"
        showLabel={false}
        name={`${fieldName}.callWebhook.name` as Path<T>}
      />
      <WebhookField<T>
        formMethods={formMethods}
        name={`${fieldName}.callWebhook` as Path<T>}
        type="result"
      />
    </>
  );
};
