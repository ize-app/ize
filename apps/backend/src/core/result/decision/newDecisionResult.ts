import { FieldDataType, FieldOption, ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./determineDecision";
import { prisma } from "../../../prisma/client";
import { NewResultArgs } from "../newResults/newResult";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const newDecisionResult = async ({
  resultConfig,
  fieldAnswers,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  fieldAnswers: FieldAnswerPrismaType[];
  requestStepId: string;
}): Promise<NewResultArgs[] | null> => {
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
    const { optionId: decisionOptionId, explanation: decisionExplanation } =
      await determineDecision({
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

    decisionExplainationResultArgs = decisionExplanation
      ? {
          name: "Explanation of AI decision",
          type: ResultType.LlmSummary,
          ResultItems: {
            create: {
              dataType: FieldDataType.String,
              value: decisionExplanation,
            },
          },
        }
      : undefined;

    newResultArgs.push(decisionResultArgs);
    if (decisionExplainationResultArgs) newResultArgs.push(decisionExplainationResultArgs);

    return newResultArgs;
  } catch (e) {
    console.error(
      `ERROR determining decision result for resultConfigId ${resultConfig.id} requestStepId ${requestStepId}`,
      e,
    );
    return null;
  }
};
