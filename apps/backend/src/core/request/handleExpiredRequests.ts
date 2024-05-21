import { prisma } from "../../prisma/client";
import { stepInclude } from "../flow/flowPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";
import { runResultsAndActions } from "../result/newResults/runResultsAndActions";

// run results and actions on newly expired requests
export const handleExpiredResults = async ({}: {}) => {
  console.log("inside handle expired requests");
  await prisma.$transaction(async (transaction) => {
    const now = new Date();

    // get request steps that are past expiration date but haven't been processed yet
    const newlyExpiredSteps = await transaction.requestStep.findMany({
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
    await transaction.requestStep.updateMany({
      where: {
        responseComplete: false,
        expirationDate: { lte: now },
      },
      data: {
        responseComplete: true,
      },
    });

    await Promise.all(
      newlyExpiredSteps.map(async (requestStep) => {
        await runResultsAndActions({
          requestStepId: requestStep.id,
          step: requestStep.Step,
          responses: requestStep.Responses,
        });
      }),
    );
  });
};
