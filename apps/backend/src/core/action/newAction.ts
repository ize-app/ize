import { ActionNewArgs, ActionNewType } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newActionConfig = async ({
  actionArgs,
  responseFieldSet,
  transaction,
}: {
  actionArgs: ActionNewArgs;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let filterOptionId: string | null = null;
  let webhookId;

  if (actionArgs.type === ActionNewType.None) return null;

  if (actionArgs.filterOptionIndex && actionArgs.filterResponseFieldIndex && responseFieldSet) {
    const responseField =
      responseFieldSet?.FieldSetFields[actionArgs.filterResponseFieldIndex].Field;

    filterOptionId =
      responseField.FieldOptionsConfigs?.FieldOptionSet.FieldOptionSetFieldOptions.find(
        (fo) => fo.index === actionArgs.filterOptionIndex,
      )?.fieldOptionId ?? null;

    if (filterOptionId === null)
      throw new GraphQLError("Cannot find action filter option.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
  }

  if (actionArgs.type === ActionNewType.CallWebhook) {
    if (!actionArgs.callWebhook) throw Error("newActionConfig: Missing action config");

    const webhook = await transaction.webhook.create({
      data: {
        ...actionArgs.callWebhook,
      },
    });
    webhookId = webhook.id;
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
