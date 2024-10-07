import { FieldOption, Prisma, ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./determineDecision";
import { prisma } from "../../../prisma/client";
import { ResultConfigPrismaType, ResultPrismaType, resultInclude } from "../resultPrismaTypes";

// returns result if there is no result
export const newDecisionResult = async ({
  resultConfig,
  fieldAnswers,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  fieldAnswers: FieldAnswerPrismaType[];
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

  // find the decision and choose default option if no decision was made
  const decisionOptionId =
    determineDecision({ decisionConfig, answers: fieldAnswers }) ?? decisionConfig.defaultOptionId;

  if (decisionOptionId) {
    decisionFieldOption = await prisma.fieldOption.findFirstOrThrow({
      where: {
        id: decisionOptionId,
      },
    });
  }

  const resultArgs: Prisma.ResultUncheckedCreateInput = {
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
  };

  ////// upsert results for decision
  return await prisma.result.upsert({
    where: {
      requestStepId_resultConfigId: {
        requestStepId,
        resultConfigId: resultConfig.id,
      },
    },
    include: resultInclude,
    create: resultArgs,
    update: resultArgs,
  });
};
