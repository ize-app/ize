import { Prisma, ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";
import {
  ResultConfigPrismaType,
  ResultGroupPrismaType,
  resultGroupInclude,
} from "../resultPrismaTypes";
import { calculateAggregateOptionWeights } from "../utils/calculateAggregateOptionWeights";

// returns result if there is no result
export const newRankingResult = async ({
  resultConfig,
  fieldAnswers,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  fieldAnswers: FieldAnswerPrismaType[];
  requestStepId: string;
}): Promise<ResultGroupPrismaType> => {
  const rankConfig = resultConfig.ResultConfigRank;

  if (resultConfig.resultType !== ResultType.Ranking || !rankConfig)
    throw new GraphQLError(
      `Cannot create ranking result without a ranking config. resultConfigId: ${resultConfig.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  const optionCount = calculateAggregateOptionWeights({ answers: fieldAnswers });

  const rankFieldOptions = await prisma.fieldOption.findMany({
    where: {
      id: {
        in: Object.keys(optionCount),
      },
    },
  });

  const hasResult = rankFieldOptions.length > 0;

  const resultArgs: Prisma.ResultGroupUncheckedCreateInput = {
    itemCount: hasResult ? 1 : 0,
    requestStepId,
    resultConfigId: resultConfig.id,
    final: true,
    hasResult,
    Result: hasResult
      ? {
          create: {
            name: "Ranking",
            itemCount: rankFieldOptions.length,
            index: 0,
            ResultItems: {
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
            },
          },
        }
      : undefined,
  };

  return await prisma.resultGroup.upsert({
    where: {
      requestStepId_resultConfigId: {
        requestStepId,
        resultConfigId: resultConfig.id,
      },
    },
    include: resultGroupInclude,
    create: resultArgs,
    update: resultArgs,
  });
};
