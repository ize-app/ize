import { MutationTestWebhookArgs } from "@/graphql/generated/resolver-types";
import { callWebhook } from "./callWebhook";
import { createTestWebhookPayload } from "./createTestWebhookPayload";

export const testWebhook = async ({
  args,
}: {
  args: MutationTestWebhookArgs;
}): Promise<boolean> => {
  const payload = createTestWebhookPayload(args.inputs);
  return await callWebhook({ uri: args.inputs.uri, payload });
};
