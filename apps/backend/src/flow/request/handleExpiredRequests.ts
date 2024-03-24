import { prisma } from "../../prisma/client";
import { stepInclude } from "../flow/flowPrismaTypes";
import { responseInclude } from "../response/type";
import { runResultsAndActions } from "../result/newResults/runResultsAndActions";

// run results and actions on newly expired requests
export const handleExpiredResults = async ({}: {}) => {
  await prisma.$transaction(async (transaction) => {
    const now = new Date();

    // get request steps that are past expiration date but haven't been processed yet
    const newlyExpiredSteps = await transaction.requestStep.findMany({
      where: {
        expired: false,
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

    await transaction.requestStep.updateMany({
      where: {
        expired: false,
        expirationDate: { lte: now },
      },
      data: {
        expired: true,
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
