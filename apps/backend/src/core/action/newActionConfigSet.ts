import { Prisma, ResultConfig } from "@prisma/client";

import { ActionArgs } from "@/graphql/generated/resolver-types";

import { newActionConfig } from "./newActionConfig";
import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

// the delimma
// if I try to a big create many up top, that means that downstream I'm going to create child tables without knowing parent id

// so you basically need to create everything at once OR you need to create the parent first and then the children

export const newActionConfigSet = async ({
  stepId,
  actionArgs,
  responseFieldSet,
  resultConfigs,
  flowVersionId,
  transaction,
}: {
  stepId: string;
  actionArgs: ActionArgs | undefined | null;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  resultConfigs: ResultConfig[];
  flowVersionId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (!actionArgs) return null;

  // currently only supporting one action on the frontend
  const dbActionArgs = await newActionConfig({
    actionArgs,
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
