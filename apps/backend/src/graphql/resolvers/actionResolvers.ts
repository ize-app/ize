import { GraphqlRequestContext } from "@graphql/context";

import { MutationTestWebhookArgs, MutationResolvers } from "@graphql/generated/resolver-types";
import { testWebhook as testWebhookService } from "@/core/action/webhook/testWebhook";
import { GraphQLError } from "graphql";
import { CustomErrorCodes } from "../errors";

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
