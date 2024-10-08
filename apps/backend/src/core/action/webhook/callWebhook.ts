import { NotificationPayload } from "@/core/notification/createNotificationPayload";
import { WebhookPayload } from "@/graphql/generated/resolver-types";

// TODO: create the payload for the webhook
export const callWebhook = async ({
  uri,
  payload,
}: {
  uri: string;
  payload?: WebhookPayload | NotificationPayload;
}) => {
  // attempt to callWebhook with Results from previous step
  const response = await fetch(uri, {
    method: "POST",
    body: JSON.stringify(payload ?? {}),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
};
