import { Prisma } from "@prisma/client";

import { executeAction } from "@/core/action/executeActions/executeAction";
import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";

import { newResults } from "./newResults";
import { ResultPrismaType } from "../resultPrismaTypes";




// creates the results and then runs actions for a given request Step
export const runResultsAndActions = async ({
  requestStepId,
  step,
  responses,
  existingResults = [],
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
      requestStepId: requestStepId,
    });

    const hasCompleteResults = results.every((result) => result.complete);

    if (hasCompleteResults) {
      await executeAction({
        step,
        results,
        requestStepId: requestStepId,
      });
    }
  } catch (e) {
    console.log("Error runResultsAndActions: ", e);
  }
};
