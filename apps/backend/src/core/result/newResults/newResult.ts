import { Prisma } from "@prisma/client";

import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { calculateBackoffMs } from "@/utils/calculateBackoffMs";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionResult } from "../decision/newDecisionResult";
import { newLlmSummaryResult } from "../llm/newLlmSummaryResult";
import { newRankingResult } from "../ranking/newRankingResult";
import { newRawAnswersResult } from "../rawAnswers.ts/newRawAnswersResult";
import {
  ResultConfigPrismaType,
  ResultGroupPrismaType,
  resultGroupInclude,
} from "../resultPrismaTypes";
import { getFieldAnswersFromResponses } from "../utils/getFieldAnswersFromResponses";

export type NewResultArgs = Omit<Prisma.ResultUncheckedCreateInput, "resultGroupId" | "index">;

export interface NewResult {
  requestStepId: string;
  resultConfig: ResultConfigPrismaType;
  existingResultGroup: ResultGroupPrismaType | undefined;
  responses: ResponsePrismaType[];
}

export const newResult = async ({
  requestStepId,
  resultConfig,
  existingResultGroup,
  responses,
}: NewResult): Promise<void> => {
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
    return await prisma.$transaction(async (transaction): Promise<void> => {
      // TODO set result status to complete on success
      let newResultArgs: NewResultArgs[] | null = [];
      switch (resultConfig.resultType) {
        case ResultType.Decision: {
          newResultArgs = await newDecisionResult({
            resultConfig,
            fieldAnswers,
            requestStepId,
            transaction,
          });
          break;
        }
        case ResultType.LlmSummary: {
          newResultArgs = await newLlmSummaryResult({
            resultConfig,
            requestStepId,
            fieldAnswers,
            transaction,
          });
          break;
        }
        case ResultType.Ranking: {
          newResultArgs = await newRankingResult({ resultConfig, fieldAnswers, requestStepId });
          break;
        }

        case ResultType.RawAnswers: {
          newResultArgs = newRawAnswersResult({ resultConfig, fieldAnswers, requestStepId });
          break;
        }

        // default: {
        //   throw Error("Unknown result type");
        // }
      }

      if (!newResultArgs) throw Error("Result config did not generate a result");
      // Delete existing individual results if they exist
      if (existingResultGroup) {
        const existingResults = existingResultGroup.Result.map((r) => r.id);
        await transaction.result.deleteMany({
          where: {
            id: {
              in: existingResults,
            },
          },
        });
      }

      const resultGroupArgs: Prisma.ResultGroupUncheckedCreateInput = {
        requestStepId,
        resultConfigId: resultConfig.id,
        complete: true,
        index: resultConfig.index,
      };

      const resultGroup = await transaction.resultGroup.upsert({
        where: {
          requestStepId_resultConfigId: {
            requestStepId,
            resultConfigId: resultConfig.id,
          },
        },
        create: resultGroupArgs,
        update: resultGroupArgs,
        include: resultGroupInclude,
      });

      await Promise.allSettled(
        newResultArgs.map(async (r, index) => {
          return await transaction.result.create({
            data: {
              resultGroupId: resultGroup.id,
              index,
              ...r,
            },
          });
        }),
      );

      return;
    });
  } catch (e) {
    // if error, retry later with exponential backoff
    console.error(
      `Error creating result. ResultConfigId ${resultConfig.id} requestStepId ${requestStepId} :`,
      e,
    );
    const retryAttempts = existingResultGroup?.retryAttempts ?? 1;
    const nextRetryAt = new Date(Date.now() + calculateBackoffMs(retryAttempts));
    await prisma.resultGroup.upsert({
      where: {
        requestStepId_resultConfigId: {
          requestStepId,
          resultConfigId: resultConfig.id,
        },
      },
      include: resultGroupInclude,
      create: {
        requestStepId,
        resultConfigId: resultConfig.id,
        complete: false,
        retryAttempts,
        nextRetryAt,
        index: resultConfig.index,
      },
      update: {
        complete: false,
        retryAttempts: {
          increment: 1,
        },
        nextRetryAt,
      },
    });
    return;
  }
};
