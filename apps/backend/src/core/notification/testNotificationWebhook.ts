import { localUrl, prodUrl } from "@/express/origins";
import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes, GraphQLError } from "@/graphql/errors";
import { MutationTestNotificationWebhookArgs } from "@/graphql/generated/resolver-types";

import { createNotificationPayload } from "./createNotificationPayload";
import { callWebhook } from "../action/webhook/callWebhook";

export const testNotificationWebhook = async ({
  args,
  context,
}: {
  args: MutationTestNotificationWebhookArgs;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  try {
    const isDev = process.env.MODE === "development";
    const baseIzeUrl = isDev ? localUrl : prodUrl;
    const payload = createNotificationPayload({
      requestId: "test",
      requestTitle: "Test Request",
      flowTitle: "Test flow",
      creatorName: context.currentUser.name,
      baseIzeUrl,
    });
    await callWebhook({ uri: args.uri, payload });
    return true;
  } catch (error) {
    console.log("Error in testNotificationWebhook", error);
    return false;
  }
};
