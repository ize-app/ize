import { Prisma, ResultConfig } from "@prisma/client";

import { ActionArgs, ActionType } from "@/graphql/generated/resolver-types";

import { newActionFilter } from "./newActionFilter";
import { createWebhook } from "./webhook/createWebhook";
import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newActionConfig = async ({
  actionArgs,
  responseFieldSet,
  resultConfigs,
  locked,
  flowVersionId,
  transaction,
}: {
  actionArgs: ActionArgs;
  locked: boolean;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  resultConfigs: ResultConfig[];
  flowVersionId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let webhookId;

  if (actionArgs.type === ActionType.CallWebhook) {
    if (!actionArgs.callWebhook) throw Error("newActionConfig: Missing action config");

    webhookId = await createWebhook({
      args: actionArgs.callWebhook,
      flowVersionId,
      transaction,
    });
  }

  const actionFilterId = await newActionFilter({
    actionFilterArgs: actionArgs.filter,
    responseFieldSet,
    resultConfigs,
    transaction,
  });

  const action = await transaction.action.create({
    data: {
      locked,
      type: actionArgs.type,
      actionFilterId,
      webhookId,
    },
  });

  return action.id;
};
