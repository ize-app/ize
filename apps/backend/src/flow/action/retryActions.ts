import { prisma } from "../../prisma/client";
import { stepInclude } from "../flow/flowPrismaTypes";
import { resultInclude } from "../result/types";
import { executeAction } from "./executeActions/executeAction";

export const retryActions = async ({}: {}) => {
  //  check if there are any request steps that don't have completed actions
  const stepsWithoutActions = await prisma.requestStep.findMany({
    where: {
      expired: true,
      resultsComplete: true,
      actionsComplete: false,
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
      });
    }),
  );
};
