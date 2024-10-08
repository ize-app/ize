import { MutationTestWebhookArgs } from "@/graphql/generated/resolver-types";

import { callWebhook } from "./callWebhook";
import { createTestWebhookPayload } from "./createTestWebhookPayload";

export const testWebhook = async ({
  args,
}: {
  args: MutationTestWebhookArgs;
}): Promise<boolean> => {
  try {
    const payload = createTestWebhookPayload(args.inputs);
    await callWebhook({ uri: args.inputs.uri, payload });
    return true;
  } catch (e) {
    console.log("Error in testWebhook", e);
    return false;
  }
};
