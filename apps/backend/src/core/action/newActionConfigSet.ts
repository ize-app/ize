import { Prisma } from "@prisma/client";

import { NewStepArgs } from "@/graphql/generated/resolver-types";

import { newActionConfig } from "./newActionConfig";

// the delimma
// if I try to a big create many up top, that means that downstream I'm going to create child tables without knowing parent id

// so you basically need to create everything at once OR you need to create the parent first and then the children

export const newActionConfigSet = async ({
  stepArgs,
  flowVersionId,
  nextStepId,
  transaction,
}: {
  stepArgs: NewStepArgs;
  flowVersionId: string;
  nextStepId: string | null;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  const {
    stepId,
    action: actionArgs,
    fieldSet: responseFieldSet,
    result: resultConfigs,
  } = stepArgs;

  if (!actionArgs) return null;

  // currently only supporting one action on the frontend
  const dbActionArgs = await newActionConfig({
    actionArgs,
    nextStepId,
    responseFieldSet,
    resultConfigs,
    flowVersionId,
    transaction,
  });

  const actionConfigSet = await transaction.actionConfigSet.create({
    data: {
      stepId,
      ActionConfigs: {
        create: { index: 0, ...dbActionArgs },
      },
    },
  });

  return actionConfigSet.id;
};
