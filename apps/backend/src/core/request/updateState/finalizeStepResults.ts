import { executeAction } from "@/core/action/executeActions/executeAction";
import { sendNewStepNotifications } from "@/core/notification/sendNewStepNotifications";
import { sendResultNotifications } from "@/core/notification/sendResultNotifications";
import { newResultsForStep } from "@/core/result/newResults/newResultsForStep";
import { prisma } from "@/prisma/client";
import { endTelegramPolls } from "@/telegram/endTelegramPolls";

import { finalizeActionAndRequest } from "./finalizeActionAndRequest";
import { finalizeStepResponses } from "./finalizeStepResponses";
import { resultGroupInclude } from "../../result/resultPrismaTypes";

// creates the results and then runs actions for a given request Step
// should only be run if resultsComplete is false
// note: all of the calls here are awaited, so that when this function is called by cron job, it doesn't exist the process prematurely
export const finalizeStepResults = async ({ requestStepId }: { requestStepId: string }) => {
  try {
    let hasResultConfigsWithoutResults = false;

    const resultGroups = await prisma.resultGroup.findMany({
      where: {
        requestStepId,
      },
      include: resultGroupInclude,
      orderBy: { index: "asc" },
    });

    const rs = await prisma.requestStep.findFirst({
      where: { id: requestStepId },
      include: {
        Step: {
          include: {
            ResultConfigSet: {
              include: {
                ResultConfigs: true,
              },
            },
          },
        },
      },
    });

    // see if there are any result configs that don't have corresponding results (even incomplete results)
    (rs?.Step.ResultConfigSet?.ResultConfigs ?? []).forEach((rc) => {
      const rg = resultGroups.find((rg) => rg.resultConfigId === rc.id);
      if (!rg) {
        hasResultConfigsWithoutResults = true;
      }
    });

    // no results means that results were never created (e.g. not enough responses)
    // in this case we should finalize the request and not run subsequent steps / actions
    if (hasResultConfigsWithoutResults) {
      await finalizeActionAndRequest({ requestStepId, finalizeRequest: true });
      return;
    }

    const resultsFinal = resultGroups.every((result) => result.complete);

    await prisma.requestStep.update({
      where: {
        id: requestStepId,
      },
      data: {
        resultsFinal,
      },
    });

    // this code block should only be run once per request step
    if (resultsFinal) {
      await endTelegramPolls({ requestStepId });
      const { nextRequestStepId, responseComplete: runResultsForNextStep } = await executeAction({
        requestStepId,
      });
      await sendResultNotifications({ requestStepId });
      if (nextRequestStepId) {
        // simplify this function later so it can just look up the flow id itself
        await sendNewStepNotifications({
          requestStepId: nextRequestStepId,
        });
        // run results for next step in cases where there is no response required (e.g. ai decision)
        // and then proceed to finalizing the step responses (which in turn may lead to finalizeStepResults being called again)
        await newResultsForStep({ requestStepId: nextRequestStepId });
        if (runResultsForNextStep) {
          await finalizeStepResponses({ requestStepId: nextRequestStepId });
        }
      }
    }
  } catch (e) {
    console.log("Error runResultsAndActions: ", e);
  }
};
