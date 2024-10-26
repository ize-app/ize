import { RequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { ResultType } from "@/graphql/generated/resolver-types";

import { openAiClient } from "./openAiClient";
import { createIzeSystemPrompt } from "./prompt/createIzeSystemPrompt";
import { createLlmSummaryPrompt } from "./prompt/createLlmSummaryPrompt";
import { createRequestContextPrompt } from "./prompt/createRequestContextPrompt";
import { createResponsesPrompt } from "./prompt/createResponsesPrompt";

export const generateAiSummary = async ({
  requestPayload,
  summaryPrompt,
  exampleOutput,
  type,
}: {
  requestPayload: RequestPayload;
  summaryPrompt: string;
  exampleOutput?: string | null;
  type: ResultType.LlmSummary | ResultType.LlmSummaryList;
}): Promise<string[]> => {
  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o", //"gpt-4", //gpt-3.5-turbo
    messages: [
      {
        role: "system",
        content: createIzeSystemPrompt(),
      },
      { role: "user", content: createRequestContextPrompt({ requestPayload }) },
      {
        role: "user",
        content: createResponsesPrompt({ fieldAnswers: requestPayload.fieldAnswers ?? [] }),
      },
      { role: "user", content: createLlmSummaryPrompt({ type, summaryPrompt, exampleOutput }) },
    ],
    response_format: { type: type === ResultType.LlmSummaryList ? "json_object" : "text" },
  });
  const message = completion.choices[0].message.content ?? "";
  const value = type === ResultType.LlmSummaryList ? extractJsonArray(message) : [message];
  if (value.length === 0) throw new Error("Empty response from AI");
  return value;
};

// the prompt instructs the AI to return list results in format {items: [item1, item2, item3]}
// this parsing function handles both the desired output and situations where the AI doesn't return the desired format
/* eslint-disable */
const extractJsonArray = (json: string): string[] => {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed;
    else if (parsed.items) {
      if (Array.isArray(parsed.items)) return parsed.items;
      else return [parsed.items];
    } else {
      return [Object.keys(parsed)[0]];
    }
  } catch (e) {
    return [json];
  }
};
/* eslint-enable */
