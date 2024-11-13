import { Prisma } from "@prisma/client";

import { newActionConfig } from "@/core/action/newAction";
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

  const responseFieldSet =
    (args.fieldSet.fields.length > 0 || args.fieldSet.locked) && args.result.length > 0
      ? await newFieldSet({
          fieldSetArgs: args.fieldSet,
          transaction,
          createdSteps,
        })
      : null;

  // console.log("responseFieldSet", responseFieldSet?.FieldSetFields);

  const hasResponse = args.fieldSet.fields.filter((f) => !f.isInternal).length > 0;

  if (hasResponse) responseConfigId = await newResponseConfig({ args: args.response, transaction });

  const resultConfigSetId = await newResultConfigSet({
    resultsArgs: args.result,
    transaction,
    responseFieldSet,
  });

  const actionId = args.action
    ? await newActionConfig({
        actionArgs: args.action,
        locked: args.action.locked ?? false,
        responseFieldSet,
        flowVersionId,
        transaction,
      })
    : null;

  const step = await transaction.step.create({
    include: stepInclude,
    data: {
      fieldSetId: responseFieldSet?.id,
      responseConfigId,
      actionId: actionId,
      resultConfigSetId: resultConfigSetId,
      index,
      flowVersionId,
    },
  });

  createdSteps.push(step);

  return step;
};
