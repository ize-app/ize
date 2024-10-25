import { GenericFieldAndValue, ResultType } from "@/graphql/generated/resolver-types";

import { createRequestContextPrompt } from "./createRequestContextPrompt";

export const createPrompt = ({
  flowName,
  requestName,
  requestTriggerAnswers,
  results,
  summaryPrompt,
  fieldName,
  responses,
  exampleOutput,
  type,
}: {
  requestName: string;
  flowName: string;
  fieldName: string;
  requestTriggerAnswers: GenericFieldAndValue[];
  results: GenericFieldAndValue[];
  summaryPrompt: string;
  responses: string[];
  exampleOutput?: string | null;
  type: ResultType.LlmSummary | ResultType.LlmSummaryList;
}) => {
  const context = createRequestContextPrompt({
    flowName,
    requestName,
    results,
    requestTriggerAnswers,
  });

  const formattedResponses = formatResponses(responses);

  const prompt = `${context}\n\n Each response had the following instructions: ${fieldName}. \n\n Summarization instructions:\n ${formatSummaryInstructions(
    type,
    summaryPrompt,
    exampleOutput,
  )} \n\n
      Responses: ${formattedResponses}`;

  return prompt;
};

const formatResponses = (responses: string[]): string => {
  return responses.reduce((acc, response) => `${acc}- ${response}\n`, "");
};

const formatSummaryInstructions = (
  type: ResultType.LlmSummary | ResultType.LlmSummaryList,
  summaryPrompt: string,
  exampleOutput?: string | null,
): string => {
  if (type === ResultType.LlmSummary) {
    return `Your goal is to create a consise summary of the reponses as a whole, not each response individually. The requestor provided this additional context on how to generate the summary: ${summaryPrompt} \n\n ${
      exampleOutput
        ? `Here's an example of what this summary can look like:\n ${exampleOutput}`
        : ""
    }`;
  } else {
    return `Your goal is to syntesize the key ideas contained in the totality of responses into a consise list. The output should be a JSON with a single key ,"items", that has a value of an array of string list items. The requestor provided this additional context on how to generate each item of this list: ${summaryPrompt} \n\n ${`Here's an example of what this JSON list should look similar to:\n
        {
          "items": [
            "${exampleOutput ?? "This is a description of a key idea from the responses"}"
          ],
        }`}`;
  }
};
