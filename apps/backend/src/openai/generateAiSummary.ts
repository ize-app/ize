import OpenAI from "openai";
import dotenv from "dotenv";
import { GenericFieldAndValue, ResultType } from "@/graphql/generated/resolver-types";
import { createPrompt } from "./createPrompt";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

type AiSummaryResult =
  | {
      complete: false;
      value: null;
    }
  | {
      complete: true;
      value: string[];
    };

// Function to summarize responses
export const generateAiSummary = async ({
  flowName,
  requestName,
  requestTriggerAnswers,
  requestResults,
  summaryPrompt,
  fieldName,
  exampleOutput,
  responses,
  type, //   maxTokensPerCall = 1500,
} //   summaryTokens = 150,
: {
  requestName: string;
  flowName: string;
  fieldName: string;
  requestTriggerAnswers: GenericFieldAndValue[];
  requestResults: GenericFieldAndValue[];
  summaryPrompt: string;
  exampleOutput?: string | null;
  type: ResultType.LlmSummary | ResultType.LlmSummaryList;
  responses: string[];
}): Promise<AiSummaryResult> => {
  const prompt = createPrompt({
    flowName,
    requestName,
    requestTriggerAnswers,
    requestResults,
    summaryPrompt,
    fieldName,
    responses,
    exampleOutput,
    type,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", //"gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a collective sensemaking platform called Ize. With Ize, users can create a 'request' to solicit group feedback about some topic and each request contains contains a 'question' for the user. Additionally, the request will include 'summarization instructions' providing additional context on how to summarize user responses. ",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: type === ResultType.LlmSummaryList ? "json_object" : "text" },
    });
    const message = completion.choices[0].message.content ?? "";
    const value = type === ResultType.LlmSummaryList ? extractJsonArray(message) : [message];
    return { complete: true, value };
  } catch (e) {
    console.log("Open AI summary error: ", e);
    return { complete: false, value: null };
  }
};
// the prompt instructs the AI to return list results in format {items: [item1, item2, item3]}
// this parsing function handles both the desired output and situations where the AI doesn't return the desired format
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
