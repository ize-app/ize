import { Prisma } from "@prisma/client";

import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { FieldDataType, ResultType } from "@/graphql/generated/resolver-types";
import { generateAiSummary } from "@/openai/generateAiSummary";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import {
  ResultConfigPrismaType,
  ResultGroupPrismaType,
  resultGroupInclude,
} from "../resultPrismaTypes";

export const newLlmSummaryResult = async ({
  resultConfig,
  requestStepId,
  type,
}: {
  resultConfig: ResultConfigPrismaType;

  requestStepId: string;
  type: ResultType.LlmSummary | ResultType.LlmSummaryList;
}): Promise<ResultGroupPrismaType> => {
  const llmConfig = resultConfig.ResultConfigLlm;

  if (
    !(
      resultConfig.resultType === ResultType.LlmSummary ||
      resultConfig.resultType === ResultType.LlmSummaryList
    ) ||
    !llmConfig
  )
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
    type,
    summaryPrompt: llmConfig.prompt,
  });

  const resultArgs: Prisma.ResultGroupUncheckedCreateInput = {
    itemCount: 1,
    requestStepId,
    resultConfigId: resultConfig.id,
    final: true,
    hasResult: true,
    Result: {
      create: {
        name: "LLM Summary",
        itemCount: res.length,
        index: 0,
        ResultItems: {
          createMany: {
            data: res.map((value) => ({
              dataType: FieldDataType.String,
              value,
            })),
          },
        },
      },
    },
  };

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
