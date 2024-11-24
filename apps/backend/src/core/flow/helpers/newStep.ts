import { Prisma } from "@prisma/client";

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
  const step = await transaction.step.create({
    data: {
      id: args.stepId,
      index,
      flowVersionId,
    },
  });

  const responseFieldSet =
    (args.fieldSet.fields.length > 0 || args.fieldSet.locked) && args.result.length > 0
      ? await newFieldSet({
          type: "response",
          stepId: step.id,
          fieldSetArgs: args.fieldSet,
          transaction,
          createdSteps,
        })
      : null;

  const hasResponse = args.fieldSet.fields.filter((f) => !f.isInternal).length > 0;

  if (hasResponse)
    await newResponseConfig({
      args: args.response,
      transaction,
      stepId: step.id,
    });

  const resultConfigs =
    (await newResultConfigSet({
      stepId: step.id,
      resultsArgs: args.result,
      transaction,
      responseFieldSet,
    })) ?? [];

  await newActionConfigSet({
    stepId: step.id,
    actionArgs: args.action,
    responseFieldSet,
    resultConfigs,
    flowVersionId,
    transaction,
  });

  const fullStep = await transaction.step.findUniqueOrThrow({
    include: stepInclude,
    where: { id: step.id },
  });

  createdSteps.push(fullStep);

  return fullStep;
};
