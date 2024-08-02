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
    webhookId: webhook.id,
    uri: "https://" + webhook.uriPreview, // Only return the hostname for privacy
    name: webhook.name,
    filterOption,
    locked,
  };
};
