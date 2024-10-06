import { executeAction } from "@/core/action/executeActions/executeAction";
import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { sendResultNotifications } from "@/core/notification/sendResultNotifications";
import { responseInclude } from "@/core/response/responsePrismaTypes";
import { prisma } from "@/prisma/client";
import { endTelegramPolls } from "@/telegram/endTelegramPolls";

import { runResultsForStep } from "./runResultsForStep";
import { resultInclude } from "../resultPrismaTypes";

// creates the results and then runs actions for a given request Step
// should only be run if resultsComplete is false
export const runResultsAndActions = async ({ requestStepId }: { requestStepId: string }) => {
  try {
    const reqStep = await prisma.requestStep.findFirstOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Step: {
          include: stepInclude,
        },
        Results: {
          include: resultInclude,
        },
        Responses: {
          include: responseInclude,
        },
      },
    });

    const results = await runResultsForStep({
      step: reqStep.Step,
      responses: reqStep.Responses,
      existingResults: reqStep.Results,
      requestStepId,
    });

    const hasCompleteResults = results.every((result) => result.complete);

    // this code block should only be run once per request step
    if (hasCompleteResults) {
      // TODO: end poll
      endTelegramPolls({ requestStepId });
      sendResultNotifications({ requestStepId });
      await executeAction({
        step: reqStep.Step,
        results,
        requestStepId,
      });
    }
  } catch (e) {
    console.log("Error runResultsAndActions: ", e);
  }
};
