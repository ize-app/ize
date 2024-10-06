import { executeAction } from "../core/action/executeActions/executeAction";
import { stepInclude } from "../core/flow/flowPrismaTypes";
import { resultInclude } from "../core/result/resultPrismaTypes";
import { prisma } from "../prisma/client";

export const retryActions = async () => {
  return await prisma.$transaction(async (transaction) => {
    //  check if there are any request steps that don't have completed actions
    const stepsWithoutActions = await transaction.requestStep.findMany({
      where: {
        resultsComplete: true,
        actionsComplete: false,
        final: false,
      },
      include: {
        Step: {
          include: stepInclude,
        },
        Results: {
          include: resultInclude,
        },
      },
    });

    // retry incomplete actions
    await Promise.all(
      stepsWithoutActions.map(async (reqStep) => {
        await executeAction({
          step: reqStep.Step,
          results: reqStep.Results,
          requestStepId: reqStep.id,
          transaction,
        });
      }),
    );
  });
};
