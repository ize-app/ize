import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { calculateBackoffMs } from "@/utils/calculateBackoffMs";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionResult } from "../decision/newDecisionResult";
import { newLlmSummaryResult } from "../llm/newLlmSummaryResult";
import { newRankingResult } from "../ranking/newRankingResult";
import { ResultPrismaType, resultInclude } from "../resultPrismaTypes";
import { getFieldAnswersFromResponses } from "../utils/getFieldAnswersFromResponses";

// goal is to attempt results for each resultConfig and create and array of both complete and incomplete results
// result can be "complete" but not have a result (e.g. not enough answers to create a decision)
// once all results are complete, mark request step as having all results so that actions can be run
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

    const attempetdResults = await Promise.all(
      resultConfigs.map(async (resultConfig) => {
        const existingResult = existingResults.find((r) => r.resultConfigId === resultConfig.id);

        if (existingResult?.complete) return existingResult;
        // check if result is ready to be retried again, if not return existing incomplete result
        if (existingResult?.nextRetryAt && existingResult.nextRetryAt > new Date()) {
          return existingResult;
        }
        const maxResultRetries = 20;
        // if result has been retried too many times, mark as complete but with no result
        if ((existingResult?.retryAttempts ?? 0) > maxResultRetries) {
          await prisma.result.update({
            where: {
              requestStepId_resultConfigId: {
                requestStepId,
                resultConfigId: resultConfig.id,
              },
            },
            data: {
              complete: true,
              hasResult: false,
            },
          });
        }

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

        // if there aren't enough anwers to create result, mark result as complete
        // remember that this function is only run once the response period has been clsoed
        if (fieldAnswers.length < resultConfig.minAnswers) {
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
          // if error, retry later with exponential backoff
          console.error(
            `Error creating result. ResultConfigId ${resultConfig.id} requestStepId ${requestStepId} :`,
            e,
          );
          const retryAttempts = existingResult?.retryAttempts ?? 1;
          const nextRetryAt = new Date(Date.now() + calculateBackoffMs(retryAttempts));
          return await prisma.result.upsert({
            where: {
              requestStepId_resultConfigId: {
                requestStepId,
                resultConfigId: resultConfig.id,
              },
            },
            include: resultInclude,
            create: {
              itemCount: 0,
              requestStepId,
              resultConfigId: resultConfig.id,
              complete: false,
              hasResult: false,
              retryAttempts,
              nextRetryAt,
            },
            update: {
              retryAttempts: {
                increment: 1,
              },
              nextRetryAt,
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
        resultsComplete: attempetdResults.every((result) => result.complete),
      },
    });

    return attempetdResults;
  });
};
