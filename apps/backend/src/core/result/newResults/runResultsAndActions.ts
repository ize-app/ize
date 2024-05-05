import { newResults } from "./newResults";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultPrismaType } from "../resultPrismaTypes";
import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { executeAction } from "@/core/action/executeActions/executeAction";

// creates the results and then runs actions for a given request Step
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
  console.log("inside run results and actions");
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
};
