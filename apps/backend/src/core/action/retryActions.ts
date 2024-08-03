import { executeAction } from "./executeActions/executeAction";
import { prisma } from "../../prisma/client";
import { stepInclude } from "../flow/flowPrismaTypes";
import { resultInclude } from "../result/resultPrismaTypes";

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
