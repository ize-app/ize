import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
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
    const answers = fieldAnswers.filter((value) => value.AnswerFreeInput.length > 0);

    rawAnswersArgs = {
      name: "Raw answers",
      type: ResultType.RawAnswers,
      ResultItems: {
        createMany: {
          data: answers.map((answer) => ({
            /// TODO will fix this once I rationalize answer type
            dataType: answer.AnswerFreeInput[0].dataType,
            value: answer.AnswerFreeInput[0].value,
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
