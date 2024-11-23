import { WebhookSchemaType } from "@/components/Form/formValidation/webhook";
import { ActionArgs, ActionType, CallWebhookArgs } from "@/graphql/generated/graphql";

import { ActionSchemaType } from "../../formValidation/action";

export const createActionArgs = (action: ActionSchemaType): ActionArgs => {
  const filter = action.filter;

  //@ts-expect-error TODO
  delete action.filterOptionId;
  return {
    locked: action.locked,
    type: action.type,
    filter: filter ? { optionId: filter.optionId, resultConfigId: filter.resultConfigId } : null,
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
