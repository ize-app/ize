import { testWebhook as testWebhookService } from "@/core/action/webhook/testWebhook";
import { GraphqlRequestContext } from "@graphql/context";
import { MutationResolvers, MutationTestWebhookArgs } from "@graphql/generated/resolver-types";

import { CustomErrorCodes, GraphQLError } from "../errors";
import { logResolverError } from "../logResolverError";

const testWebhook: MutationResolvers["testWebhook"] = async (
  root: unknown,
  args: MutationTestWebhookArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  try {
    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });
    return await testWebhookService({ args });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { location: "graphql", resolver: "testWebhook", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

export const actionMutations = {
  testWebhook,
};
