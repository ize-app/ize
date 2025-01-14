import { FieldOption, Prisma, ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { newValue } from "@/core/value/newValue";
import { validateValue } from "@/core/value/validateValue";
import { ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./determineDecision";
import { prisma } from "../../../prisma/client";
import { NewResultArgs } from "../newResults/newResult";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const newDecisionResult = async ({
  resultConfig,
  fieldAnswers,
  requestStepId,
  transaction,
}: {
  resultConfig: ResultConfigPrismaType;
  fieldAnswers: FieldAnswerPrismaType[];
  requestStepId: string;
  transaction: Prisma.TransactionClient;
}): Promise<{ resultArgs: NewResultArgs[] | null; endStepEarly: boolean }> => {
  const decisionConfig = resultConfig.ResultConfigDecision;
  let decisionResultArgs: NewResultArgs | undefined;
  let decisionExplainationResultArgs: NewResultArgs | undefined;
  const newResultArgs: NewResultArgs[] = [];

  // find the decision and choose default option if no decision was made
  try {
    if (resultConfig.resultType !== ResultType.Decision || !decisionConfig)
      throw new GraphQLError(
        `Cannot create decision result without a decision config. resultConfigId: ${resultConfig.id}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );
    let decisionFieldOption: FieldOption | null = null;
    const {
      optionId: decisionOptionId,
      explanation: decisionExplanation,
      endStepEarly,
    } = await determineDecision({
      resultConfig,
      answers: fieldAnswers,
      requestStepId,
    });

    // check that decision is actually valid
    if (decisionOptionId) {
      decisionFieldOption = await prisma.fieldOption.findFirstOrThrow({
        where: {
          id: decisionOptionId,
        },
      });
    }

    decisionResultArgs = {
      name: "Decision",
      // if decisionFieldOption is null, the decision was not made but we still
      // need to make a result record of no decision
      type: ResultType.Decision,
      answerCount: fieldAnswers.length,
      ResultItems: decisionFieldOption
        ? {
            create: {
              index: 0,
              valueId: decisionFieldOption.valueId,
              fieldOptionId: decisionFieldOption.id,
            },
          }
        : undefined,
    };

    if (decisionExplanation) {
      const validatedValue = validateValue({ type: ValueType.String, value: decisionExplanation });
      const valueId = await newValue({ value: validatedValue, transaction });
      decisionExplainationResultArgs = {
        name: "Explanation of AI decision",
        type: ResultType.LlmSummary,
        answerCount: fieldAnswers.length,
        ResultItems: {
          create: {
            index: 0,
            valueId,
          },
        },
      };
    }

    newResultArgs.push(decisionResultArgs);
    if (decisionExplainationResultArgs) newResultArgs.push(decisionExplainationResultArgs);

    return { resultArgs: newResultArgs, endStepEarly };
  } catch (e) {
    console.error(
      `ERROR determining decision result for resultConfigId ${resultConfig.id} requestStepId ${requestStepId}`,
      e,
    );
    return { resultArgs: null, endStepEarly: false };
  }
};
