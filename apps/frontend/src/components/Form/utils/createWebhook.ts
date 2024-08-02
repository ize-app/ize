import { apolloClient } from "@/graphql/apollo";
import { CreateWebhookDocument } from "@/graphql/generated/graphql";

import { createCallWebhookArgs } from "../FlowForm/helpers/createNewFlowArgs/createActionArgs";
import { WebhookSchemaType } from "../formValidation/webhook";

export const createWebhook = async ({ webhookArgs }: { webhookArgs: WebhookSchemaType }) => {
  const res = await apolloClient.mutate({
    mutation: CreateWebhookDocument,
    variables: {
      inputs: createCallWebhookArgs(webhookArgs),
    },
  });

  return res.data?.createWebhook;
};
