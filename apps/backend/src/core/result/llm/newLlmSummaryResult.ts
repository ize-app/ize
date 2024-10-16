import { Prisma } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
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
  fieldAnswers,
  requestStepId,
  type,
}: {
  resultConfig: ResultConfigPrismaType;
  fieldAnswers: FieldAnswerPrismaType[];
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

  const { requestName, flowName, requestTriggerAnswers, requestResults, field } =
    await createRequestPayload({
      requestStepId,
      fieldId: resultConfig.fieldId,
    });

  if (!field) throw Error("Field is undefined");

  const res = await generateAiSummary({
    flowName,
    requestName,
    requestTriggerAnswers,
    requestResults,
    fieldName: field?.name,
    type,
    exampleOutput: llmConfig.example,
    summaryPrompt: llmConfig.prompt,
    responses: fieldAnswers
      .filter((r) => r.AnswerFreeInput.length > 0)
      .map((r) => r.AnswerFreeInput[0].value),
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
