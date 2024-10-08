import { runResultsAndActions } from "../core/result/newResults/runResultsAndActions";
import { prisma } from "../prisma/client";

// run results and actions on newly expired requests
export const handleExpiredResults = async () => {
  const now = new Date();
  try {
    // get request steps that are past expiration date but haven't been processed yet
    const newlyExpiredSteps = await prisma.requestStep.findMany({
      where: {
        responseFinal: false,
        expirationDate: { lte: now },
      },
    });

    // stop allowing responses on expired requests
    await prisma.requestStep.updateMany({
      where: {
        responseFinal: false,
        expirationDate: { lte: now },
      },
      data: {
        responseFinal: true,
      },
    });

    return await Promise.all(
      newlyExpiredSteps.map(async (requestStep) => {
        return await runResultsAndActions({
          requestStepId: requestStep.id,
        });
      }),
    );
  } catch (error) {
    console.error("Error in handleExpiredResults:", error);
  }
};
