// import { telegramBot } from "@/telegram/TelegramClient";

import { stepInclude } from "../core/flow/flowPrismaTypes";
import { responseInclude } from "../core/response/responsePrismaTypes";
import { runResultsAndActions } from "../core/result/newResults/runResultsAndActions";
import { resultInclude } from "../core/result/resultPrismaTypes";
import { prisma } from "../prisma/client";
export const retryNewResults = async () => {
  try {
    //  check if there are any request steps that don't have completed results
    const stepsWithoutResults = await prisma.requestStep.findMany({
      where: {
        responseComplete: true,
        resultsComplete: false,
        final: false,
      },
      include: {
        Step: {
          include: stepInclude,
        },
        Responses: {
          include: responseInclude,
        },
        Results: {
          include: resultInclude,
        },
      },
    });

    // retry getting results for each result
    await Promise.all(
      stepsWithoutResults.map(async (reqStep) => {
        console.log("rerunning results for request step: ", reqStep.id);
        await runResultsAndActions({
          requestStepId: reqStep.id,
        });
      }),
    );
  } catch (error) {
    console.error("Error in retryNewResults:", error);
  }
};
