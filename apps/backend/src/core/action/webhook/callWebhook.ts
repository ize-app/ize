import { NotificationPayload } from "@/core/notification/createNotificationPayload";
import { WebhookPayload } from "@/graphql/generated/resolver-types";

// TODO: create the payload for the webhook
export const callWebhook = async ({
  uri,
  payload,
}: {
  uri: string;
  payload?: WebhookPayload | NotificationPayload;
}): Promise<boolean> => {
  // attempt to callWebhook with Results from previous step
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(payload ?? {}),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return true;
  } catch (e) {
    console.log("Call webhook action error: ", e);
    return false;
  }
};
