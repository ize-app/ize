import { Prisma } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { getRequestResults } from "@/core/request/utils/getRequestResults";
import { getRequestTriggerFieldAnswers } from "@/core/request/utils/getRequestTriggerFieldAnswers";
import { FieldDataType, ResultType } from "@/graphql/generated/resolver-types";
import { generateAiSummary } from "@/openai/generateAiSummary";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ResultConfigPrismaType, ResultPrismaType, resultInclude } from "../resultPrismaTypes";

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
}): Promise<ResultPrismaType> => {
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

  const reqStep = await prisma.requestStep.findUniqueOrThrow({
    include: {
      Request: {
        include: requestInclude,
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const request = await requestResolver({
    req: reqStep.Request,
    context: { currentUser: null, discordApi: undefined },
    userGroupIds: [],
  });

  let fieldName: string | null = null;

  request.flow.steps.forEach((step) => {
    step.response.fields.map((field) => {
      if (field.fieldId === resultConfig.fieldId) fieldName = field.name;
    });
  });

  if (!fieldName)
    throw new GraphQLError(
      `Can't find name of field for resultConfigId: ${resultConfig.id} and requestId ${request.requestId}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  const requestName = request.name;
  const flowName = request.flow.name;
  const requestTriggerAnswers = getRequestTriggerFieldAnswers({ request });
  const requestResults = getRequestResults({ request });

  const res = await generateAiSummary({
    flowName,
    requestName,
    requestTriggerAnswers,
    requestResults,
    fieldName,
    type,
    exampleOutput: llmConfig.example,
    summaryPrompt: llmConfig.prompt,
    responses: fieldAnswers
      .filter((r) => r.AnswerFreeInput.length > 0)
      .map((r) => r.AnswerFreeInput[0].value),
  });

  const resultArgs: Prisma.ResultUncheckedCreateInput = {
    itemCount: res.length,
    requestStepId,
    resultConfigId: resultConfig.id,
    final: true,
    hasResult: true,
    ResultItems: {
      createMany: {
        data: res.map((value) => ({
          dataType: FieldDataType.String,
          value,
        })),
      },
    },
  };

  return await prisma.result.upsert({
    where: {
      requestStepId_resultConfigId: {
        requestStepId,
        resultConfigId: resultConfig.id,
      },
    },
    include: resultInclude,
    create: resultArgs,
    update: resultArgs,
  });
};
