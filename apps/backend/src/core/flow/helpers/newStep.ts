import { Prisma, ResultConfig } from "@prisma/client";

import { newActionConfigSet } from "@/core/action/newActionConfigSet";
import { newFieldSet } from "@/core/fields/newFieldSet";
import { newResponseConfig } from "@/core/response/newResponseConfig";
import { newResultConfigSet } from "@/core/result/newResultConfig";
import { NewStepArgs } from "@/graphql/generated/resolver-types";

import { StepPrismaType, stepInclude } from "../flowPrismaTypes";

export const newStep = async ({
  args,
  flowVersionId,
  index,
  createdSteps,
  transaction,
}: {
  args: NewStepArgs;
  flowVersionId: string;
  index: number;
  createdSteps: StepPrismaType[];
  transaction: Prisma.TransactionClient;
}): Promise<StepPrismaType> => {
  let responseConfigId: string | null = null;
  let resultConfigSetId: string | undefined = undefined;
  let resultConfigs: ResultConfig[] = [];

  const responseFieldSet =
    (args.fieldSet.fields.length > 0 || args.fieldSet.locked) && args.result.length > 0
      ? await newFieldSet({
          fieldSetArgs: args.fieldSet,
          transaction,
          createdSteps,
        })
      : null;

  const hasResponse = args.fieldSet.fields.filter((f) => !f.isInternal).length > 0;

  if (hasResponse) responseConfigId = await newResponseConfig({ args: args.response, transaction });

  const resultConfig = await newResultConfigSet({
    resultsArgs: args.result,
    transaction,
    responseFieldSet,
  });
  if (resultConfig) {
    [resultConfigSetId, resultConfigs] = resultConfig;
  }

  const actionConfigSetId = await newActionConfigSet({
    actionArgs: args.action,
    responseFieldSet,
    resultConfigs,
    flowVersionId,
    transaction,
  });

  const step = await transaction.step.create({
    include: stepInclude,
    data: {
      fieldSetId: responseFieldSet?.id,
      responseConfigId,
      actionConfigSetId,
      resultConfigSetId,
      index,
      flowVersionId,
    },
  });

  createdSteps.push(step);

  return step;
};
