import { testWebhook as testWebhookService } from "@/core/action/webhook/testWebhook";
import { GraphqlRequestContext } from "@graphql/context";
import { MutationResolvers, MutationTestWebhookArgs } from "@graphql/generated/resolver-types";

import { CustomErrorCodes, GraphQLError } from "../errors";

const testWebhook: MutationResolvers["testWebhook"] = async (
  root: unknown,
  args: MutationTestWebhookArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  return await testWebhookService({ args });
};

export const actionMutations = {
  testWebhook,
};
