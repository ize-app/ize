import { RequestStep } from "@prisma/client";

import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { calculateBackoffMs } from "@/utils/calculateBackoffMs";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionResult } from "../decision/newDecisionResult";
import { newLlmSummaryResult } from "../llm/newLlmSummaryResult";
import { newRankingResult } from "../ranking/newRankingResult";
import { ResultGroupPrismaType, resultGroupInclude } from "../resultPrismaTypes";
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
  existingResults?: ResultGroupPrismaType[];
}): Promise<RequestStep> => {
  return await prisma.$transaction(async (transaction) => {
    const resultConfigs =
      step.ResultConfigSet?.ResultConfigSetResultConfigs.map((r) => r.ResultConfig) ?? [];

    const attempetdResults: ResultGroupPrismaType[] = await Promise.all(
      resultConfigs.map(async (resultConfig) => {
        const maxResultRetries = 20;

        const existingResult = existingResults.find((r) => r.resultConfigId === resultConfig.id);

        if (existingResult?.final) return existingResult;
        // if result has been retried too many times, mark as complete but with no result
        if ((existingResult?.retryAttempts ?? 0) > maxResultRetries) {
          await prisma.resultGroup.update({
            where: {
              requestStepId_resultConfigId: {
                requestStepId,
                resultConfigId: resultConfig.id,
              },
            },
            data: {
              final: true,
              hasResult: false,
            },
          });
        }

        // if there aren't enough anwers to create result, mark result as complete
        // remember that this function is only run once the response period has been clsoed
        if (step.ResponseConfig && responses.length < step.ResponseConfig.minResponses) {
          return await prisma.resultGroup.create({
            include: resultGroupInclude,
            data: {
              itemCount: 0,
              requestStepId,
              resultConfigId: resultConfig.id,
              final: true,
              hasResult: false,
            },
          });
        }

        // check if result is ready to be retried again, if not return existing incomplete result
        if (existingResult?.nextRetryAt && existingResult.nextRetryAt > new Date()) {
          return existingResult;
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

        try {
          // TODO set result status to complete on success
          switch (resultConfig.resultType) {
            case ResultType.Decision: {
              return await newDecisionResult({
                resultConfig,
                fieldAnswers,
                requestStepId,
              });
            }
            case ResultType.LlmSummary: {
              return await newLlmSummaryResult({
                resultConfig,
                requestStepId,
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
          return await prisma.resultGroup.upsert({
            where: {
              requestStepId_resultConfigId: {
                requestStepId,
                resultConfigId: resultConfig.id,
              },
            },
            include: resultGroupInclude,
            create: {
              itemCount: 0,
              requestStepId,
              resultConfigId: resultConfig.id,
              final: false,
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
    return await transaction.requestStep.update({
      where: {
        id: requestStepId,
      },
      data: {
        responseFinal: true,
        resultsFinal: attempetdResults.every((result) => result.final),
      },
    });
  });
};
