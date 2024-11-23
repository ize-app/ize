import { Prisma, ResultConfig } from "@prisma/client";

import { ActionArgs } from "@/graphql/generated/resolver-types";

import { newActionFilter } from "./newActionFilter";
import { newWebhookAction } from "./webhook/newWebhookAction";
import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

type PrismaWebhookActionConfigArgs = Omit<
  Prisma.ActionConfigUncheckedCreateInput,
  "actionConfigSetId" | "index"
>;

export const newActionConfig = async ({
  actionArgs,
  responseFieldSet,
  resultConfigs,
  flowVersionId,
  transaction,
}: {
  actionArgs: ActionArgs;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  resultConfigs: ResultConfig[];
  flowVersionId: string;
  transaction: Prisma.TransactionClient;
}): Promise<PrismaWebhookActionConfigArgs> => {
  const webhookArgs = await newWebhookAction({
    actionArgs,
    flowVersionId,
    transaction,
  });

  const actionFilterArgs = newActionFilter({
    actionFilterArgs: actionArgs.filter,
    responseFieldSet,
    resultConfigs,
  });

  const actionConfigArgs: PrismaWebhookActionConfigArgs = {
    locked: actionArgs.locked,
    type: actionArgs.type,
    ActionConfigFilter: actionFilterArgs ? { create: actionFilterArgs } : undefined,
    ActionConfigWebhook: webhookArgs ? { create: webhookArgs } : undefined,
  };

  return actionConfigArgs;
};
