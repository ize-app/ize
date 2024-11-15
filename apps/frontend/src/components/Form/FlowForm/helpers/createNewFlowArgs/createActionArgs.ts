import { WebhookSchemaType } from "@/components/Form/formValidation/webhook";
import { ActionArgs, ActionType, CallWebhookArgs, FieldType } from "@/graphql/generated/graphql";

import { ActionSchemaType } from "../../formValidation/action";
import { FieldsSchemaType } from "../../formValidation/fields";

export const createActionArgs = (
  action: ActionSchemaType,
  responseFields: FieldsSchemaType | undefined,
): ActionArgs => {
  let filterOptionIndex: number | null = null;
  let filterResponseFieldIndex: number | null = null;

  if (action.filterOptionId) {
    (responseFields ?? []).forEach((f, fieldIndex) => {
      if (f.type === FieldType.Options) {
        const optionIndex = f.optionsConfig.options.findIndex((o) => {
          return o.optionId === action.filterOptionId;
        });
        if (optionIndex !== -1) {
          filterOptionIndex = optionIndex;
          filterResponseFieldIndex = fieldIndex;
        }
      }
    });
    if (typeof filterOptionIndex !== "number") {
      throw Error("Action filter option not found ");
    }
  }

  //@ts-expect-error TODO
  delete action.filterOptionId;
  return {
    locked: action.locked,
    type: action.type,
    filterOptionIndex,
    filterResponseFieldIndex,
    callWebhook:
      action.type === ActionType.CallWebhook ? createCallWebhookArgs(action.callWebhook) : null,
  };
};

export const createCallWebhookArgs = (webhook: WebhookSchemaType): CallWebhookArgs => {
  return {
    name: webhook.name ?? "Webhook",
    uri: webhook.uri ?? "",
    originalUri: webhook.originalUri,
    webhookId: webhook.webhookId,
  };
};
