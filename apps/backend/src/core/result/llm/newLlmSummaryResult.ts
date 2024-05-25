import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { getFieldAnswersFromResponses } from "../utils/getFieldAnswersFromResponses";
import { ResultConfigPrismaType, ResultPrismaType, resultInclude } from "../resultPrismaTypes";
import { FieldDataType, ResultType } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { prisma } from "@/prisma/client";
import { generateAiSummary } from "@/openai/generateAiSummary";
import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { getRequestResults } from "@/core/request/utils/getRequestResults";
import { getRequestTriggerFieldAnswers } from "@/core/request/utils/getRequestTriggerFieldAnswers";

export const newLlmSummaryResult = async ({
  resultConfig,
  responses,
  requestStepId,
  type,
}: {
  resultConfig: ResultConfigPrismaType;
  responses: ResponsePrismaType[];
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

  const request = requestResolver({
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

  const responsesCleaned = getFieldAnswersFromResponses({
    fieldId: resultConfig.fieldId,
    responses,
  });

  const res = await generateAiSummary({
    flowName,
    requestName,
    requestTriggerAnswers,
    requestResults,
    fieldName,
    type,
    exampleOutput: llmConfig.example,
    summaryPrompt: llmConfig.prompt,
    responses: responsesCleaned
      .filter((r) => r.AnswerFreeInput.length > 0)
      .map((r) => r.AnswerFreeInput[0].value),
  });

  ////// create results for that decision
  return await prisma.result.create({
    include: resultInclude,
    data: {
      itemCount: res.complete ? res.value.length : 0,
      requestStepId,
      resultConfigId: resultConfig.id,
      complete: res.complete,
      hasResult: res.complete,
      ResultItems: res.complete
        ? {
            createMany: {
              data: res.value.map((value) => ({
                dataType: FieldDataType.String,
                value,
              })),
            },
          }
        : undefined,
    },
  });
};
