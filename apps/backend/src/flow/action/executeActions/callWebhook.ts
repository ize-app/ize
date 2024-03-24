import { WebhookPrismaType } from "../types";

// TODO: create the payload for the webhook
export const callWebhook = async ({
  webhook,
}: {
  webhook: WebhookPrismaType;
}): Promise<boolean> => {
  // attempt to callWebhook with Results from previous step
  try {
    const response = await fetch(webhook.uri, {
      method: "POST",
      body: JSON.stringify({}),
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
