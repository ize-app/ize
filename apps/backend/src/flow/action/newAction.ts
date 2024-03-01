import { ActionNewArgs, ActionNewType } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { FieldPrismaType } from "../fields/fieldPrismaTypes";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newActionConfig = async ({
  actionArgs,
  responseField,
  transaction,
}: {
  actionArgs: ActionNewArgs;
  responseField: FieldPrismaType | undefined;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let filterOptionId: string | null = null;
  let webhookId;

  if (actionArgs.type === ActionNewType.None) return null;

  if (actionArgs.filterOptionIndex && responseField) {
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

  const action = await transaction.actionNew.create({
    data: {
      type: actionArgs.type,
      filterOptionId,
      webhookId,
    },
  });

  return action.id;
};
