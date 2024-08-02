import { testWebhook as testWebhookService } from "@/core/action/webhook/testWebhook";
import { GraphqlRequestContext } from "@graphql/context";
import {
  MutationCreateWebhookArgs,
  MutationResolvers,
  MutationTestWebhookArgs,
} from "@graphql/generated/resolver-types";
import { createWebhook as createWebhookService } from "@/core/action/webhook/createWebhook";

import { CustomErrorCodes, GraphQLError } from "../errors";
import { prisma } from "@/prisma/client";

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

const createWebhook: MutationResolvers["createWebhook"] = async (
  root: unknown,
  args: MutationCreateWebhookArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  return await prisma.$transaction(async (transaction) => {
    return await createWebhookService({ args: args.inputs, transaction });
  });
};

export const actionMutations = {
  testWebhook,
  createWebhook,
};
