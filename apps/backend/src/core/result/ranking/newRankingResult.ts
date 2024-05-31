import { ResultType } from "@prisma/client";

import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";
import { ResultConfigPrismaType, ResultPrismaType, resultInclude } from "../resultPrismaTypes";
import { calculateAggregateOptionWeights } from "../utils/calculateAggregateOptionWeights";
import { getFieldAnswersFromResponses } from "../utils/getFieldAnswersFromResponses";

// returns result if there is no result
export const newRankingResult = async ({
  resultConfig,
  responses,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  responses: ResponsePrismaType[];
  requestStepId: string;
}): Promise<ResultPrismaType> => {
  const rankConfig = resultConfig.ResultConfigRank;

  if (resultConfig.resultType !== ResultType.Ranking || !rankConfig)
    throw new GraphQLError(
      `Cannot create ranking result without a ranking config. resultConfigId: ${resultConfig.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  if (!resultConfig.fieldId)
    throw new GraphQLError(
      `Result config for decision is missing a fieldId: resultConfigId: ${resultConfig.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  const fieldAnswers = getFieldAnswersFromResponses({ fieldId: resultConfig.fieldId, responses });
  const optionCount = calculateAggregateOptionWeights({ answers: fieldAnswers });

  const rankFieldOptions = await prisma.fieldOption.findMany({
    where: {
      id: {
        in: Object.keys(optionCount),
      },
    },
  });

  const hasResult = fieldAnswers.length >= resultConfig.minAnswers && rankFieldOptions.length > 0;
  /// create ranking results
  return await prisma.result.create({
    include: resultInclude,
    data: {
      itemCount: rankFieldOptions.length,
      requestStepId,
      resultConfigId: resultConfig.id,
      complete: true,
      hasResult,
      ResultItems: hasResult
        ? {
            createMany: {
              data: rankFieldOptions
                .map((option) => ({
                  dataType: option.dataType,
                  value: option.name,
                  fieldOptionId: option.id,
                  // calculate average weight of each option
                  weight: optionCount[option.id] / fieldAnswers.length,
                }))
                // rank in ascending order of weight
                .sort((a, b) => b.weight - a.weight)
                .slice(0, rankConfig.numOptionsToInclude ?? undefined),
            },
          }
        : undefined,
    },
  });
};
