// needs to distn

import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultPrismaType } from "../resultPrismaTypes";
import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
import { newDecisionResult } from "../decision/newDecisionResult";
import { newLlmSummaryResult } from "../llm/newLlmSummaryResult";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { newRankingResult } from "../ranking/newRankingResult";

// return type should distinguish between what completed and what didn't run yet
export const newResults = async ({
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
}): Promise<ResultPrismaType[]> => {
  const resultConfigs =
    step.ResultConfigSet?.ResultConfigSetResultConfigs.map((r) => r.ResultConfig) ?? [];

  // run results from each
  const possibleResults = await Promise.all(
    resultConfigs.map(async (resultConfig) => {
      const existingResult = existingResults.find((r) => r.resultConfigId === resultConfig.id);
      if (existingResult) return existingResult;
      // TODO set result status to complete on success
      switch (resultConfig.resultType) {
        case ResultType.Decision: {
          return await newDecisionResult({ resultConfig, responses, requestStepId });
        }
        case ResultType.LlmSummary: {
          return await newLlmSummaryResult({ resultConfig, responses, requestStepId });
        }
        case ResultType.Ranking: {
          return await newRankingResult({ resultConfig, responses, requestStepId });
        }
        default: {
          throw Error("");
        }
      }
    }),
  );

  // remove result configs that did not produce a result
  // but keep resultsConfigs that were supposed to create a result but didn't complete
  const attemptedResults = possibleResults.filter((r) => r !== null) as ResultPrismaType[];

  // update request step with outcome
  await transaction.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      responseComplete: true,
      resultsComplete: attemptedResults.every((result) => result.complete),
    },
  });

  return attemptedResults;
};
