import { Prisma } from "@prisma/client";

import { executeAction } from "@/core/action/executeActions/executeAction";
import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { sendResultNotifications } from "@/core/notification/sendResultNotifications";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { prisma } from "@/prisma/client";
import { endTelegramPolls } from "@/telegram/endTelegramPolls";

import { newResults } from "./newResults";
import { ResultPrismaType } from "../resultPrismaTypes";

// creates the results and then runs actions for a given request Step
// should only be run if resultsComplete is false
export const runResultsAndActions = async ({
  requestStepId,
  step,
  responses,
  existingResults = [],
  transaction = prisma,
}: {
  requestStepId: string;
  step: StepPrismaType;
  responses: ResponsePrismaType[];
  existingResults?: ResultPrismaType[];
  transaction?: Prisma.TransactionClient;
}) => {
  try {
    const results = await newResults({
      step,
      responses,
      existingResults,
      requestStepId,
    });
    const hasCompleteResults = results.every((result) => result.complete);

    // this code block should only be run once per request step
    if (hasCompleteResults) {
      // TODO: end poll
      endTelegramPolls({ requestStepId });
      sendResultNotifications({ requestStepId });
      await executeAction({
        step,
        results,
        requestStepId,
        transaction,
      });
    }
  } catch (e) {
    console.log("Error runResultsAndActions: ", e);
  }
};
