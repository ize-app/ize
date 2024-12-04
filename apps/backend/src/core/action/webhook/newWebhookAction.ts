import { ActionConfigWebhook, Prisma } from "@prisma/client";
import { parse } from "tldts";

import { ActionArgs, ActionType } from "@/graphql/generated/resolver-types";
import { encrypt } from "@/prisma/encrypt";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

type PrismaWebhookActionConfigArgs = Omit<
  Prisma.ActionConfigWebhookUncheckedCreateInput,
  "actionConfigId"
>;

// the goal of this function is to
// 1) not expose previously created webhooks on the FE while
// 2) still allow users to reuse webhook configurations from the past when evolve a flow or group from the past
// 2) not allow a user to reuse a webhook tha wasn't part of their group / flow
export const newWebhookAction = async ({
  actionArgs,
  flowVersionId,
  transaction,
}: {
  actionArgs: ActionArgs;
  flowVersionId?: string;
  transaction: Prisma.TransactionClient;
}): Promise<PrismaWebhookActionConfigArgs | undefined> => {
  let existingWebhook: ActionConfigWebhook | null = null;

  if (actionArgs.type !== ActionType.CallWebhook) return undefined;

  const args = actionArgs.callWebhook;

  if (!args)
    throw new GraphQLError(`Missing webhook args`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (args.webhookId) {
    // see if this webhook id already exists and is associated to a given flow
    if (flowVersionId) {
      existingWebhook = await transaction.actionConfigWebhook.findUnique({
        where: {
          id: args.webhookId,
          ActionConfig: {
            ActionConfigSet: {
              Step: {
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
      });
    }
  }

  const dbWebhookArgs: PrismaWebhookActionConfigArgs = {
    name: args.name,
    uri:
      !!existingWebhook && args.uri === args.originalUri ? existingWebhook.uri : encrypt(args.uri),
    uriPreview:
      !!existingWebhook && args.uri === args.originalUri
        ? existingWebhook.uriPreview
        : parse(args.uri).domain ?? "",
  };

  return dbWebhookArgs;
};
