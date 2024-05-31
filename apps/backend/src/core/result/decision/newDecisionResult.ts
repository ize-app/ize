import { FieldOption, ResultType } from "@prisma/client";

import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./determineDecision";
import { prisma } from "../../../prisma/client";
import { ResultConfigPrismaType, ResultPrismaType, resultInclude } from "../resultPrismaTypes";
import { getFieldAnswersFromResponses } from "../utils/getFieldAnswersFromResponses";

// returns result if there is no result
export const newDecisionResult = async ({
  resultConfig,
  responses,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  responses: ResponsePrismaType[];
  requestStepId: string;
}): Promise<ResultPrismaType> => {
  const decisionConfig = resultConfig.ResultConfigDecision;
  let decisionFieldOption: FieldOption | null = null;

  if (resultConfig.resultType !== ResultType.Decision || !decisionConfig)
    throw new GraphQLError(
      `Cannot create decision result without a decision config. resultConfigId: ${resultConfig.id}`,
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

  // find the decision and choose default option if no decision was made
  const decisionOptionId =
    determineDecision({ decisionConfig, answers: fieldAnswers }) ?? decisionConfig.defaultOptionId;

  // only create a record of a decision if the minimum number of answers have been provided and there is a decision
  if (decisionOptionId && fieldAnswers.length >= resultConfig.minAnswers) {
    decisionFieldOption = await prisma.fieldOption.findFirstOrThrow({
      where: {
        id: decisionOptionId,
      },
    });
  }

  ////// create results for that decision
  return await prisma.result.create({
    include: resultInclude,
    data: {
      itemCount: decisionFieldOption ? 1 : 0,
      requestStepId,
      resultConfigId: resultConfig.id,
      complete: true,
      hasResult: !!decisionFieldOption,
      ResultItems: decisionFieldOption
        ? {
            create: {
              dataType: decisionFieldOption.dataType,
              value: decisionFieldOption.name,
              fieldOptionId: decisionFieldOption.id,
            },
          }
        : undefined,
    },
  });
};
