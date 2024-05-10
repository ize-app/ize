import { GraphqlRequestContext } from "@graphql/context";

import { MutationTestWebhookArgs, MutationResolvers } from "@graphql/generated/resolver-types";
import { testWebhook as testWebhookService } from "@/core/action/webhook/testWebhook";

const testWebhook: MutationResolvers["testWebhook"] = async (
  root: unknown,
  args: MutationTestWebhookArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  return await testWebhookService({ args });
};

export const actionMutations = {
  testWebhook,
};
