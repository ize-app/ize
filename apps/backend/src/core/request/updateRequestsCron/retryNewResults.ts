import { newResultsForStep } from "@/core/result/newResults/newResultsForStep";

import { prisma } from "../../../prisma/client";
import { finalizeStepResults } from "../updateState/finalizeStepResults";
export const retryNewResults = async () => {
  try {
    //  check if there are any request steps that don't have completed results
    const stepsWithoutResults = await prisma.requestStep.findMany({
      where: {
        responseFinal: true,
        resultsFinal: false,
        final: false,
      },
    });

    // retry getting results for each result
    await Promise.allSettled(
      stepsWithoutResults.map(async (reqStep) => {
        await newResultsForStep({ requestStepId: reqStep.id, isRetry: true });
        await finalizeStepResults({
          requestStepId: reqStep.id,
        });
      }),
    );
    return;
  } catch (error) {
    console.error("Error in retryNewResults:", error);
    return;
  }
};
