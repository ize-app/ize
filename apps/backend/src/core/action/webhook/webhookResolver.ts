import { Webhook } from "@prisma/client";

import { CallWebhook, Option } from "@/graphql/generated/resolver-types";

export const callWebhookResolver = (
  {
    webhook,
    filterOption,
    name,
    locked = false,
  }: { webhook: Webhook; filterOption: Option | undefined; locked: boolean; name: string },
  // obscureUri = true,
): CallWebhook => {
  return {
    __typename: "CallWebhook",
    name,
    webhookId: webhook.id,
    uri: "https://" + webhook.uriPreview, // Only return the hostname for privacy
    webhookName: webhook.name,
    filterOption,
    locked,
  };
};
