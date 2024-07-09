import { prisma } from "../../prisma/client";
import { stepInclude } from "../flow/flowPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";
import { runResultsAndActions } from "../result/newResults/runResultsAndActions";

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
