import { DecisionType, ResultType } from "@prisma/client";

import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { createDecisionPrompt } from "@/openai/createDecisionPrompt";
import { createRequestContextPrompt } from "@/openai/createRequestContextPrompt";
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

  const { requestName, flowName, requestTriggerAnswers, requestResults, field } =
    await createRequestPayload({
      requestStepId,
      fieldId: resultConfig.fieldId,
    });

  if (!field) throw Error("Field is undefined");

  const requestContext = createRequestContextPrompt({
    requestName,
    flowName,
    requestTriggerAnswers,
    requestResults,
  });

  const decisionPrompt = createDecisionPrompt({ field, criteria });

  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o", //"gpt-4", //gpt-3.5-turbo
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for a collective sensemaking platform called Ize. With Ize, users can create a 'request' to solicit group feedback about some topic. Each request contains context about what the user is being asked to respond to. Additionally, the request will include 'summarization instructions' providing additional context on how to summarize user responses. Get right to the point and don't use filler phrases like 'Based on the responses provided', 'Summary of responses' or ambiguous suggestions like 'It may be beneficial to further discuss...'. Be as consise as possible - do not repeat yourself.",
      },
      { role: "user", content: requestContext },
      { role: "user", content: decisionPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const message = completion.choices[0].message.content ?? "";

  const result = JSON.parse(message) as DecisionResult;

  return result;
};
