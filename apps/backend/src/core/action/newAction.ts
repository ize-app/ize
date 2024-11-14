import { Prisma } from "@prisma/client";

import { ActionArgs, ActionType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { createWebhook } from "./webhook/createWebhook";
import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newActionConfig = async ({
  actionArgs,
  responseFieldSet,
  locked,
  flowVersionId,
  transaction,
}: {
  actionArgs: ActionArgs;
  locked: boolean;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  flowVersionId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let filterOptionId: string | null | undefined = null;
  let webhookId;

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

    webhookId = await createWebhook({
      args: actionArgs.callWebhook,
      flowVersionId,
      transaction,
    });
  }

  const action = await transaction.action.create({
    data: {
      locked,
      type: actionArgs.type,
      filterOptionId,
      webhookId,
    },
  });

  return action.id;
};
