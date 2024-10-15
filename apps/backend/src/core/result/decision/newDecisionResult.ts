import { FieldOption, Prisma, ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./determineDecision";
import { prisma } from "../../../prisma/client";
import {
  ResultConfigPrismaType,
  ResultGroupPrismaType,
  resultGroupInclude,
} from "../resultPrismaTypes";

// returns result if there is no result
export const newDecisionResult = async ({
  resultConfig,
  fieldAnswers,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  fieldAnswers: FieldAnswerPrismaType[];
  requestStepId: string;
}): Promise<ResultGroupPrismaType> => {
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

  const resultArgs: Prisma.ResultGroupUncheckedCreateInput = {
    itemCount: decisionFieldOption ? 1 : 0,
    requestStepId,
    resultConfigId: resultConfig.id,
    final: true,
    hasResult: !!decisionFieldOption,
    Result: decisionFieldOption
      ? {
          create: {
            name: "Decision",
            itemCount: 1,
            index: 0,
            ResultItems: {
              create: {
                dataType: decisionFieldOption.dataType,
                value: decisionFieldOption.name,
                fieldOptionId: decisionFieldOption.id,
              },
            },
          },
        }
      : undefined,
  };

  ////// upsert results for decision
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
