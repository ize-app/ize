import { Prisma } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { newValue } from "@/core/value/newValue";
import { validateValue } from "@/core/value/validateValue";
import { ResultType, ValueType } from "@/graphql/generated/resolver-types";
import { generateAiSummary } from "@/openai/generateAiSummary";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { NewResultArgs } from "../newResults/newResult";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const newLlmSummaryResult = async ({
  resultConfig,
  requestStepId,
  transaction,
  fieldAnswers,
}: {
  resultConfig: ResultConfigPrismaType;
  requestStepId: string;
  fieldAnswers: FieldAnswerPrismaType[];
  transaction: Prisma.TransactionClient;
}): Promise<NewResultArgs[] | null> => {
  const llmConfig = resultConfig.ResultConfigLlm;
  let llmResultArgs: NewResultArgs | undefined;

  try {
    if (!(resultConfig.resultType === ResultType.LlmSummary) || !llmConfig)
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

    const res = await generateAiSummary({
      requestStepId,
      isList: llmConfig.isList,
      summaryPrompt: llmConfig.prompt,
      resultConfigId: resultConfig.id,
    });

    const valueIds = await Promise.all(
      res.map(async (llmString) => {
        const validatedValue = validateValue({
          type: ValueType.String,
          value: llmString,
        });
        const valueId = await newValue({ value: validatedValue, transaction });
        return valueId;
      }),
    );

    llmResultArgs = {
      name: "LLM summary",
      type: ResultType.LlmSummary,
      answerCount: fieldAnswers.length,
      ResultItems: {
        createMany: {
          data: valueIds.map((valueId, index) => ({
            index,
            valueId,
          })),
        },
      },
    };

    return [llmResultArgs];
  } catch (e) {
    console.error(
      `ERROR determining decision result for resultConfigId ${resultConfig.id} requestStepId ${requestStepId}`,
      e,
    );
    return null;
  }
};
