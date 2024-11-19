import { FieldOption, ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";
import { NewResultArgs } from "../newResults/newResult";
import { ResultConfigPrismaType } from "../resultPrismaTypes";
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
}): Promise<NewResultArgs[] | null> => {
  const rankConfig = resultConfig.ResultConfigRank;
  let rankFieldOptions: FieldOption[] = [];
  let rankResultArgs: NewResultArgs | undefined;

  try {
    if (resultConfig.resultType !== ResultType.Ranking || !rankConfig)
      throw new GraphQLError(
        `Cannot create ranking result without a ranking config. resultConfigId: ${resultConfig.id}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    const optionCount: { [key: string]: number } = calculateAggregateOptionWeights({
      answers: fieldAnswers,
    });
    rankFieldOptions = await prisma.fieldOption.findMany({
      where: {
        id: {
          in: Object.keys(optionCount),
        },
      },
    });
    rankResultArgs = {
      name: "Ranking",

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
    };
    return [rankResultArgs];
  } catch (e) {
    console.error(
      `ERROR determining ranking result for resultConfigId ${resultConfig.id} requestStepId ${requestStepId}`,
      e,
    );
    return null;
  }
};
