import { Webhook } from "@prisma/client";

import { CallWebhook, Option } from "@/graphql/generated/resolver-types";

export const callWebhookResolver = (
  {
    webhook,
    filterOption,
    locked = false,
  }: { webhook: Webhook; filterOption: Option | undefined; locked: boolean },
  // obscureUri = true,
): CallWebhook => {
  return {
    __typename: "CallWebhook",
    name: webhook.name,
    webhookId: webhook.id,
    uri: "https://" + webhook.uriPreview, // Only return the hostname for privacy
    webhookName: webhook.name,
    filterOption,
    locked,
  };
};
