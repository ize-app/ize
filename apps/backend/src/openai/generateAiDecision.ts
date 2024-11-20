import { DecisionType, FieldType, ResultType } from "@prisma/client";

import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { openAiClient } from "@/openai/openAiClient";
import { AiDecisionResult, createDecisionPrompt } from "@/openai/prompt/createDecisionPrompt";
import { createRequestContextPrompt } from "@/openai/prompt/createRequestContextPrompt";
import { createResponsesPrompt } from "@/openai/prompt/createResponsesPrompt";

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

  const criteria = resultConfig.ResultConfigDecision.criteria;

  const requestPayload = await createRequestPayload({
    requestStepId,
    fieldId: resultConfig.fieldId,
  });

  const { field } = requestPayload;

  if (!field) throw new Error("Field is undefined");

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
          requestPayload,
          resultConfigId: resultConfig.id,
        }),
      },
      {
        role: "user",
        content: createResponsesPrompt({ fieldAnswers: requestPayload.fieldAnswers ?? [] }),
      },
      {
        role: "user",
        content: createDecisionPrompt({
          field,
          criteria,
          hasResponse: (requestPayload?.fieldAnswers ?? []).length > 0,
        }),
      },
    ],
    response_format: { type: "json_object" },
  });

  const message = completion.choices[0].message.content ?? "";

  const result = JSON.parse(message) as AiDecisionResult;

  if (field.__typename !== FieldType.Options) throw Error("Field is not an options field");

  const option = field.options[result.optionNumber - 1];

  if (!option) throw Error("Invalid option");

  return { explanation: result.explanation, optionId: option.optionId };
};
