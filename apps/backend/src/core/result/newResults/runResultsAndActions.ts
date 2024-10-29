import { executeAction } from "@/core/action/executeActions/executeAction";
import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { sendNewStepNotifications } from "@/core/notification/sendNewStepNotifications";
import { sendResultNotifications } from "@/core/notification/sendResultNotifications";
import { responseInclude } from "@/core/response/responsePrismaTypes";
import { prisma } from "@/prisma/client";
import { endTelegramPolls } from "@/telegram/endTelegramPolls";

import { runResultsForStep } from "./runResultsForStep";
import { resultGroupInclude } from "../resultPrismaTypes";

// creates the results and then runs actions for a given request Step
// should only be run if resultsComplete is false
export const runResultsAndActions = async ({ requestStepId }: { requestStepId: string }) => {
  try {
    const reqStep = await prisma.requestStep.findFirstOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Request: {
          include: {
            FlowVersion: true,
          },
        },
        Step: {
          include: stepInclude,
        },
        ResultGroups: {
          include: resultGroupInclude,
        },
        Responses: {
          include: responseInclude,
        },
      },
    });

    const results = await runResultsForStep({
      step: reqStep.Step,
      responses: reqStep.Responses,
      existingResults: reqStep.ResultGroups,
      requestStepId,
    });

    const hasCompleteResults = results.resultsFinal;

    // this code block should only be run once per request step
    if (hasCompleteResults) {
      // TODO: end poll
      endTelegramPolls({ requestStepId });
      sendResultNotifications({ requestStepId });
      const { nextRequestStepId, runResultsForNextStep } = await executeAction({
        requestStepId,
      });
      if (nextRequestStepId) {
        // simplify this function later so it can just look up the flow id itself
        sendNewStepNotifications({
          flowId: reqStep.Request.FlowVersion.flowId,
          requestStepId: nextRequestStepId,
        });
        // run results for next step in cases where there is no response required (e.g. ai decision)
        if (runResultsForNextStep) {
          await runResultsAndActions({ requestStepId: nextRequestStepId });
        }
      }
      // if nextRequestStepId
      //// call runResultsAndActions with nextRequestStepId
      //// call sendNewStepNotifications with nextRequestStepId
    }
  } catch (e) {
    console.log("Error runResultsAndActions: ", e);
  }
};
