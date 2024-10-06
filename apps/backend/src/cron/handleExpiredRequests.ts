import { stepInclude } from "../core/flow/flowPrismaTypes";
import { responseInclude } from "../core/response/responsePrismaTypes";
import { runResultsAndActions } from "../core/result/newResults/runResultsAndActions";
import { prisma } from "../prisma/client";

// run results and actions on newly expired requests
export const handleExpiredResults = async () => {
  const now = new Date();
  try {
    // get request steps that are past expiration date but haven't been processed yet
    const newlyExpiredSteps = await prisma.requestStep.findMany({
      where: {
        responseComplete: false,
        expirationDate: { lte: now },
      },
      include: {
        Responses: {
          include: responseInclude,
        },
        Step: {
          include: stepInclude,
        },
      },
    });

    // stop allowing responses on expired requests
    await prisma.requestStep.updateMany({
      where: {
        responseComplete: false,
        expirationDate: { lte: now },
      },
      data: {
        responseComplete: true,
      },
    });

    return await Promise.all(
      newlyExpiredSteps.map(async (requestStep) => {
        return await runResultsAndActions({
          requestStepId: requestStep.id,
          step: requestStep.Step,
          responses: requestStep.Responses,
        });
      }),
    );
  } catch (error) {
    console.error("Error in handleExpiredResults:", error);
    throw error;
  } finally {
    // Ensure all connections are properly closed
    await prisma.$disconnect();
  }
};
