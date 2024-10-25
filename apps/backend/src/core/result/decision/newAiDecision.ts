import { DecisionType, FieldType, ResultType } from "@prisma/client";
import { ChatCompletionMessageParam } from "openai/resources";

import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { AiDecisionResult, createDecisionPrompt } from "@/openai/createDecisionPrompt";
import { createRequestContextPrompt } from "@/openai/createRequestContextPrompt";
import { createResponsesPrompt } from "@/openai/createResponsesPrompt";
import { openAiClient } from "@/openai/openAiClient";

import { DecisionResult } from "./determineDecision";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const newAiDecision = async ({
  resultConfig,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  requestStepId: string;
}): Promise<DecisionResult> => {
  if (
    !resultConfig.fieldId ||
    resultConfig.resultType !== ResultType.Decision ||
    resultConfig.ResultConfigDecision?.type !== DecisionType.Ai
  )
    throw new Error("FieldId is undefined");

  const criteria = resultConfig.ResultConfigDecision.criteria;

  const prompts: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant for a collective sensemaking platform called Ize. With Ize, users can create a 'request' to solicit group feedback about some topic. Each request contains context about what the user is being asked to respond to. Additionally, the request will include 'summarization instructions' providing additional context on how to summarize user responses. Get right to the point and don't use filler phrases like 'Based on the responses provided', 'Summary of responses' or ambiguous suggestions like 'It may be beneficial to further discuss...'. Be as consise as possible - do not repeat yourself.",
    },
  ];

  const { requestName, flowName, requestTriggerAnswers, results, field, fieldAnswers } =
    await createRequestPayload({
      requestStepId,
      fieldId: resultConfig.fieldId,
    });

  if (!field) throw Error("Field is undefined");

  const hasResponse = (fieldAnswers ?? []).length > 0;

  const requestContext = createRequestContextPrompt({
    requestName,
    flowName,
    requestTriggerAnswers,
    results,
  });
  prompts.push({ role: "user", content: requestContext });

  const decisionPrompt = createDecisionPrompt({ field, criteria, hasResponse });

  prompts.push({ role: "system", content: decisionPrompt });

  if (hasResponse)
    prompts.push({
      role: "user",
      content: createResponsesPrompt({ fieldAnswers: fieldAnswers ?? [] }),
    });

  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o", //"gpt-4", //gpt-3.5-turbo
    messages: prompts,
    response_format: { type: "json_object" },
  });

  const message = completion.choices[0].message.content ?? "";

  const result = JSON.parse(message) as AiDecisionResult;

  if (field.__typename !== FieldType.Options) throw Error("Field is not an options field");

  const option = field.options[result.optionNumber - 1];

  if (!option) throw Error("Invalid option");

  return { explanation: result.explanation, optionId: option.optionId };
};
