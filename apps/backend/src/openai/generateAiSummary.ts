import { GenericFieldAndValue, ResultType } from "@/graphql/generated/resolver-types";

import { createPrompt } from "./createPrompt";
import { openAiClient } from "./openAiClient";

// Function to summarize responses
export const generateAiSummary = async ({
  flowName,
  requestName,
  requestTriggerAnswers,
  results,
  summaryPrompt,
  fieldName,
  exampleOutput,
  responses,
  type, //   maxTokensPerCall = 1500,
  //   summaryTokens = 150,
}: {
  requestName: string;
  flowName: string;
  fieldName: string;
  requestTriggerAnswers: GenericFieldAndValue[];
  results: GenericFieldAndValue[];
  summaryPrompt: string;
  exampleOutput?: string | null;
  type: ResultType.LlmSummary | ResultType.LlmSummaryList;
  responses: string[];
}): Promise<string[]> => {
  const prompt = createPrompt({
    flowName,
    requestName,
    requestTriggerAnswers,
    results,
    summaryPrompt,
    fieldName,
    responses,
    exampleOutput,
    type,
  });
  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o", //"gpt-4", //gpt-3.5-turbo
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for a collective sensemaking platform called Ize. With Ize, users can create a 'request' to solicit group feedback about some topic. Each request contains context about what the user is being asked to respond to. Additionally, the request will include 'summarization instructions' providing additional context on how to summarize user responses. Get right to the point and don't use filler phrases like 'Based on the responses provided', 'Summary of responses' or ambiguous suggestions like 'It may be beneficial to further discuss...'. Be as consise as possible - do not repeat yourself.",
      },
      { role: "user", content: prompt },
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
