import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionResult } from "../decision/newDecisionResult";
import { newLlmSummaryResult } from "../llm/newLlmSummaryResult";
import { newRankingResult } from "../ranking/newRankingResult";
import { ResultPrismaType, resultInclude } from "../resultPrismaTypes";
import { getFieldAnswersFromResponses } from "../utils/getFieldAnswersFromResponses";

// return type should distinguish between what completed and what didn't run yet
export const runResultsForStep = async ({
  requestStepId,
  step,
  responses,
  existingResults = [],
}: {
  requestStepId: string;
  step: StepPrismaType;
  responses: ResponsePrismaType[];
  existingResults?: ResultPrismaType[];
}): Promise<ResultPrismaType[]> => {
  return await prisma.$transaction(async (transaction) => {
    const resultConfigs =
      step.ResultConfigSet?.ResultConfigSetResultConfigs.map((r) => r.ResultConfig) ?? [];

    // run results from each
    const possibleResults = await Promise.all(
      resultConfigs.map(async (resultConfig) => {
        const existingResult = existingResults.find(
          (r) => r.resultConfigId === resultConfig.id && r.complete,
        );
        if (existingResult) return existingResult;

        if (!resultConfig.fieldId)
          throw new GraphQLError(
            `Result config for decision is missing a fieldId: resultConfigId: ${resultConfig.id}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        const fieldAnswers = getFieldAnswersFromResponses({
          fieldId: resultConfig.fieldId,
          responses,
        });

        if (fieldAnswers.length < resultConfig.minAnswers) {
          // create result with complete = true and hasResult = false
          return await prisma.result.create({
            include: resultInclude,
            data: {
              itemCount: 0,
              requestStepId,
              resultConfigId: resultConfig.id,
              complete: true,
              hasResult: false,
            },
          });
        }
        try {
          // TODO set result status to complete on success
          switch (resultConfig.resultType) {
            case ResultType.Decision: {
              return await newDecisionResult({ resultConfig, fieldAnswers, requestStepId });
            }
            case ResultType.LlmSummary: {
              return await newLlmSummaryResult({
                resultConfig,
                fieldAnswers,
                requestStepId,
                type: ResultType.LlmSummary,
              });
            }
            case ResultType.LlmSummaryList: {
              return await newLlmSummaryResult({
                resultConfig,
                fieldAnswers,
                requestStepId,
                type: ResultType.LlmSummaryList,
              });
            }
            case ResultType.Ranking: {
              return await newRankingResult({ resultConfig, fieldAnswers, requestStepId });
            }
            default: {
              throw Error("");
            }
          }
        } catch (e) {
          console.error(
            `Error creating result. ResultConfigId ${resultConfig.id} requestStepId ${requestStepId} :`,
            e,
          );
          return await prisma.result.create({
            include: resultInclude,
            data: {
              itemCount: 0,
              requestStepId,
              resultConfigId: resultConfig.id,
              complete: false,
              hasResult: false,
            },
          });
        }
      }),
    );

    // update request step with outcome
    await transaction.requestStep.update({
      where: {
        id: requestStepId,
      },
      data: {
        responseComplete: true,
        resultsComplete: possibleResults.every((result) => result.complete),
      },
    });

    return possibleResults;
  });
};
