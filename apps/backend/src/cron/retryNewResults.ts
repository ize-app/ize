import { runResultsAndActions } from "../core/result/newResults/runResultsAndActions";
import { prisma } from "../prisma/client";
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
    await Promise.all(
      stepsWithoutResults.map(async (reqStep) => {
        await runResultsAndActions({
          requestStepId: reqStep.id,
        });
      }),
    );
  } catch (error) {
    console.error("Error in retryNewResults:", error);
  }
};
