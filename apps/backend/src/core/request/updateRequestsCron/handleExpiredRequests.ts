import { prisma } from "../../../prisma/client";
import { finalizeStepResults } from "../updateState/finalizeStepResults";

// get all steps where response is not final and is expired
// attempt to finalize results if they are all complete so rest of step execution can complete
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

    await Promise.allSettled(
      newlyExpiredSteps.map(async (requestStep) => {
        return await finalizeStepResults({
          requestStepId: requestStep.id,
        });
      }),
    );
  } catch (error) {
    console.error("Error in handleExpiredResults:", error);
  }
};
