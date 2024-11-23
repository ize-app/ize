import { Webhook } from "@prisma/client";

import { ActionFilter, CallWebhook } from "@/graphql/generated/resolver-types";

export const callWebhookResolver = (
  {
    webhook,
    filter,
    name,
    locked = false,
  }: { webhook: Webhook; filter: ActionFilter | undefined; locked: boolean; name: string },
  // obscureUri = true,
): CallWebhook => {
  return {
    __typename: "CallWebhook",
    name,
    webhookId: webhook.id,
    uri: "https://" + webhook.uriPreview, // Only return the hostname for privacy
    webhookName: webhook.name,
    filter,
    locked,
  };
};
