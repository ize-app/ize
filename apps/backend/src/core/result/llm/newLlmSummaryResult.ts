import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { FieldDataType, ResultType } from "@/graphql/generated/resolver-types";
import { generateAiSummary } from "@/openai/generateAiSummary";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { NewResultArgs } from "../newResults/newResult";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const newLlmSummaryResult = async ({
  resultConfig,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  requestStepId: string;
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

    const requestPayload = await createRequestPayload({
      requestStepId,
      fieldId: resultConfig.fieldId,
    });

    const res = await generateAiSummary({
      requestPayload,
      isList: llmConfig.isList,
      summaryPrompt: llmConfig.prompt,
      resultConfigId: resultConfig.id,
    });

    llmResultArgs = {
      name: "LLM Summary",
      type: ResultType.LlmSummary,
      ResultItems: {
        createMany: {
          data: res.map((value) => ({
            dataType: FieldDataType.String,
            value,
          })),
        },
      },
    };

    // console.log("llmResultArgs", llmResultArgs);
    // throw Error("test error");

    return [llmResultArgs];
  } catch (e) {
    console.error(
      `ERROR determining decision result for resultConfigId ${resultConfig.id} requestStepId ${requestStepId}`,
      e,
    );
    return null;
  }
};
