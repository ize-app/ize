import { ActionArgs, ActionType, CallWebhookArgs, FieldType } from "@/graphql/generated/graphql";

import { ActionSchemaType } from "../../formValidation/action";
import { DefaultOptionSelection, FieldsSchemaType } from "../../formValidation/fields";

export const createActionArgs = (
  action: ActionSchemaType,
  responseFields: FieldsSchemaType | undefined,
): ActionArgs => {
  let filterOptionIndex: number | null = null;
  let filterResponseFieldIndex: number | null = null;

  if (action.type !== ActionType.None && action.filterOptionId) {
    if (action.filterOptionId !== DefaultOptionSelection.None.toString()) {
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
  }

  //@ts-expect-error TODO
  delete action.filterOptionId;
return {
    locked: action.locked,
    type: action.type,
    filterOptionIndex,
    filterResponseFieldIndex,
    callWebhook: createCallWebhookArgs(action),
  };
};

const createCallWebhookArgs = (action: ActionSchemaType): CallWebhookArgs | null => {
  if (action.type !== ActionType.CallWebhook) return null;
  return {
    name: action.callWebhook.name ?? "Webhook",
    uri: action.callWebhook.uri ?? "",
    originalUri: action.callWebhook.originalUri,
    webhookId: action.callWebhook.webhookId,
  };
};
