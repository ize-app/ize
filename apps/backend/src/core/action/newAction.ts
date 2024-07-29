import { Prisma } from "@prisma/client";

import { ActionArgs, ActionType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { createWebhook } from "./webhook/createWebhook";
import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newActionConfig = async ({
  actionArgs,
  responseFieldSet,
  transaction,
}: {
  actionArgs: ActionArgs;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let filterOptionId: string | null | undefined = null;
  let webhookId;

  if (actionArgs.type === ActionType.None) return null;

  if (
    typeof actionArgs.filterOptionIndex === "number" &&
    typeof actionArgs.filterResponseFieldIndex === "number" &&
    responseFieldSet
  ) {
    const responseField =
      responseFieldSet?.FieldSetFields[actionArgs.filterResponseFieldIndex].Field;

    filterOptionId =
      responseField.FieldOptionsConfigs?.FieldOptionSet.FieldOptionSetFieldOptions.find((fo) => {
        return fo.index === actionArgs.filterOptionIndex;
      })?.fieldOptionId;

    if (!filterOptionId)
      throw new GraphQLError("Cannot find action filter option.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
  }

  if (actionArgs.type === ActionType.CallWebhook) {
    if (!actionArgs.callWebhook) throw Error("newActionConfig: Missing action config");

    await createWebhook({
      name: actionArgs.callWebhook.name,
      uri: actionArgs.callWebhook.uri,
      transaction,
    });
  }

  const action = await transaction.action.create({
    data: {
      type: actionArgs.type,
      filterOptionId,
      webhookId,
    },
  });

  return action.id;
};
