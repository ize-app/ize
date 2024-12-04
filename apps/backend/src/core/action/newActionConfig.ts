import { Prisma } from "@prisma/client";

import { ActionArgs, FieldSetArgs, ResultArgs } from "@/graphql/generated/resolver-types";

import { newActionFilter } from "./newActionFilter";
import { newTriggerStepAction } from "./webhook/newTriggerStepAction";
import { newWebhookAction } from "./webhook/newWebhookAction";

type PrismaWebhookActionConfigArgs = Omit<
  Prisma.ActionConfigUncheckedCreateInput,
  "actionConfigSetId" | "index"
>;

export const newActionConfig = async ({
  actionArgs,
  nextStepId,
  responseFieldSet,
  resultConfigs,
  flowVersionId,
  transaction,
}: {
  actionArgs: ActionArgs;
  nextStepId: string | null;
  responseFieldSet: FieldSetArgs;
  resultConfigs: ResultArgs[];
  flowVersionId: string;
  transaction: Prisma.TransactionClient;
}): Promise<PrismaWebhookActionConfigArgs> => {
  const webhookArgs = await newWebhookAction({
    actionArgs,
    flowVersionId,
    transaction,
  });

  const triggerStepArgs = newTriggerStepAction({
    actionArgs,
    nextStepId,
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
    ActionConfigTriggerStep: triggerStepArgs ? { create: triggerStepArgs } : undefined,
  };

  return actionConfigArgs;
};
