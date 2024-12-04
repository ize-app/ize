import { DecisionType, ResultType } from "@prisma/client";

import { getRequestByRequestStepId } from "@/core/request/getRequestByRequestStepId";
import { openAiClient } from "@/openai/openAiClient";
import { AiDecisionResult, createDecisionPrompt } from "@/openai/prompt/createDecisionPrompt";
import { createRequestContextPrompt } from "@/openai/prompt/createRequestContextPrompt";
import { createResponsesPrompt } from "@/openai/prompt/createResponsesPrompt";

import { getFieldForRequestConfigId } from "./getFieldForRequestConfigId";
import { createIzeSystemPrompt } from "./prompt/createIzeSystemPrompt";
import { DecisionResult } from "../core/result/decision/determineDecision";
import { ResultConfigPrismaType } from "../core/result/resultPrismaTypes";

export const generateAiDecision = async ({
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

  const request = await getRequestByRequestStepId({ requestStepId });

  let hasResponse = false;

  request.requestSteps.forEach((requestStep) => {
    const answer = requestStep.answers.find((answer) => {
      answer.field.fieldId === resultConfig.fieldId;
    });
    if (answer && answer.answers.length > 0) hasResponse = true;
  });

  const field = getFieldForRequestConfigId({
    request,
    requestStepId,
    resultConfigId: resultConfig.id,
  });

  const criteria = resultConfig.ResultConfigDecision.criteria;

  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o", //"gpt-4", //gpt-3.5-turbo
    messages: [
      {
        role: "system",
        content: createIzeSystemPrompt(),
      },
      {
        role: "user",
        content: createRequestContextPrompt({
          request,
          requestStepId,
        }),
      },
      {
        role: "user",
        content: createResponsesPrompt({ request }),
      },
      {
        role: "user",
        content: createDecisionPrompt({
          field,
          criteria,
          hasResponse,
        }),
      },
    ],
    response_format: { type: "json_object" },
  });

  const message = completion.choices[0].message.content ?? "";

  const result = JSON.parse(message) as AiDecisionResult;

  if (!field.optionsConfig) throw Error("Field is not an options field");

  const option = field.optionsConfig.options[result.optionNumber - 1];

  if (!option) throw Error("Invalid option");

  return { explanation: result.explanation, optionId: option.optionId };
};
