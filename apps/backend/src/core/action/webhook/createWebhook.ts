import { Prisma, Webhook } from "@prisma/client";
import { parse } from "tldts";

import { CallWebhookArgs } from "@/graphql/generated/resolver-types";
import { encrypt } from "@/prisma/encrypt";

// the goal of this function is to
// 1) not expose previously created webhooks on the FE while
// 2) still allow users to reuse webhook configurations from the past when evolve a flow or group from the past
// 2) not allow a user to reuse a webhook tha wasn't part of their group / flow
export const createWebhook = async ({
  args,
  flowVersionId,
  groupId,
  transaction,
}: {
  args: CallWebhookArgs;
  flowVersionId?: string;
  groupId?: string;
  transaction: Prisma.TransactionClient;
}) => {
  console.log("inside createWebhook");
  let existingWebhook: Webhook | null = null;

  if (args.webhookId) {
    // see if this webhook id already exists and is associated to a given flow
    if (flowVersionId) {
      existingWebhook = await transaction.webhook.findUnique({
        where: {
          id: args.webhookId,
          Actions: {
            some: {
              Steps: {
                some: {
                  FlowVersion: {
                    Flow: {
                      FlowVersions: {
                        some: {
                          id: flowVersionId,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // see if this webhook id already exists and is associated to a given group
    if (groupId) {
      existingWebhook = await transaction.webhook.findUnique({
        where: {
          id: args.webhookId,
          GroupCustom: {
            some: {
              groupId,
            },
          },
        },
      });
    }
  }

  const webhook = await transaction.webhook.create({
    data: {
      name: args.name,
      uri:
        !!existingWebhook && args.uri === args.originalUri
          ? existingWebhook.uri
          : encrypt(args.uri),
      uriPreview:
        !!existingWebhook && args.uri === args.originalUri
          ? existingWebhook.uriPreview
          : parse(args.uri).domain ?? "",
    },
  });
  return webhook.id;
};
