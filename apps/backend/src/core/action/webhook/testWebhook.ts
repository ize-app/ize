import { MutationTestWebhookArgs } from "@/graphql/generated/resolver-types";

export const testWebhook = async ({
  args,
}: {
  args: MutationTestWebhookArgs;
}): Promise<boolean> => {
  //   console.log("inside test webhook. args are ", args);
  return true;
};
