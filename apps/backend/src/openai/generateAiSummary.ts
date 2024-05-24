import OpenAI from "openai";
import dotenv from "dotenv";
import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";
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
  responses, //   maxTokensPerCall = 1500,
  //   summaryTokens = 150,
}: {
  requestName: string;
  flowName: string;
  fieldName: string;
  requestTriggerAnswers: GenericFieldAndValue[];
  requestResults: GenericFieldAndValue[];
  summaryPrompt: string;
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
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", //"gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a collective sensemaking platform called Ize. With Ize, users can create a 'request' to solicit group feedback about some topic and each request contains contains a 'question' for the user. Additionally, the request will include 'summarization instructions' providing additional context on how to summarize user responses. Your goal is not to summarize each individual response, but rather a high-level summary of the responses as a whole. ",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "text" },
    });
    const message = completion.choices[0].message.content ?? ""; // should this throw an error instead?
    return { complete: true, value: [message] };
  } catch (e) {
    console.log("Open AI summary error: ", e);
    return { complete: false, value: null };
  }
};
