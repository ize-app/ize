import { ResultType } from "@/graphql/generated/resolver-types";

export const createLlmSummaryPrompt = ({
  type,
  summaryPrompt,
  exampleOutput,
}: {
  type: ResultType.LlmSummary | ResultType.LlmSummaryList;
  summaryPrompt: string;
  exampleOutput?: string | null;
}): string => {
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
