import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultConfigPrismaType, ResultPrismaType, resultInclude } from "../resultPrismaTypes";
import { FieldOption, ResultType } from "@prisma/client";
import { prisma } from "../../../prisma/client";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { determineDecision } from "./determineDecision";
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
}): Promise<ResultPrismaType | null> => {
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

  if (fieldAnswers.length < resultConfig.minAnswers) return null;

  // find the decision and choose default option if no decision was made
  let decisionOptionId =
    determineDecision({ decisionConfig, answers: fieldAnswers }) ?? decisionConfig.defaultOptionId;

  if (decisionOptionId) {
    decisionFieldOption = await prisma.fieldOption.findFirstOrThrow({
      where: {
        id: decisionOptionId,
      },
    });

    ////// create results for that decision
    return await prisma.resultsNew.create({
      include: resultInclude,
      data: {
        itemCount: 1,
        requestStepId,
        resultConfigId: resultConfig.id,
        complete: true,
        ResultItems: {
          create: {
            dataType: decisionFieldOption.dataType,
            value: decisionFieldOption.name,
            fieldOptionId: decisionFieldOption.id,
          },
        },
      },
    });
  }

  ////// end the requestStep (potentially tricky --> need to make sure other results are calcualted)
  return null;
};
