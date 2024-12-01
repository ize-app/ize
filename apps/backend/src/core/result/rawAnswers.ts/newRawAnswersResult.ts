import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ResultType, ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { NewResultArgs } from "../newResults/newResult";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const newRawAnswersResult = ({
  resultConfig,
  requestStepId,
  fieldAnswers,
}: {
  resultConfig: ResultConfigPrismaType;
  requestStepId: string;
  fieldAnswers: FieldAnswerPrismaType[];
}): NewResultArgs[] | null => {
  let rawAnswersArgs: NewResultArgs | undefined;

  try {
    if (!(resultConfig.resultType === ResultType.RawAnswers))
      throw new GraphQLError(
        `Cannot create llm result without a llm config. resultConfigId: ${resultConfig.id}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    if (!resultConfig.fieldId)
      throw new GraphQLError(
        `Result config for llm summary is missing a fieldId: resultConfigId: ${resultConfig.id}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    // only free input answers can be part of a raw result
    // TODO: add support for options
    const answers = fieldAnswers.filter((fa) => fa.Value.type !== ValueType.OptionSelections);

    rawAnswersArgs = {
      name: "Raw answers",
      type: ResultType.RawAnswers,
      answerCount: answers.length,
      ResultItems: {
        createMany: {
          data: answers.map((answer, index) => ({
            index,
            valueId: answer.valueId,
          })),
        },
      },
    };

    return [rawAnswersArgs];
  } catch (e) {
    console.error(
      `ERROR determining decision result for resultConfigId ${resultConfig.id} requestStepId ${requestStepId}`,
      e,
    );
    return null;
  }
};
