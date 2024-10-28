import { ResultType } from "@/graphql/generated/resolver-types";

import { llmSummaryListExamples } from "../examples/llmSummaryListExamples";

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
    const flowDefinedSummaryInstructions =
      summaryPrompt &&
      summaryPrompt.length > 8 &&
      `The requestor provided this additional context on how to generate the summary: ${summaryPrompt}.\n\n`;

    const flowDefinedExampleOutput =
      exampleOutput &&
      exampleOutput.length > 8 &&
      `The requestor also provided this example of what the summary should look like: ${exampleOutput}.\n\n`;

    return `Your goal is to create a consise summary of the reponses as a whole, not each response individually. Ideally, your summary would be only a short paragraph but you can do a few paragraphs if there are important nuances to explore. \n\n${flowDefinedSummaryInstructions} ${
      flowDefinedExampleOutput
    }`;
  } else {
    const flowSummaryInstructions =
      summaryPrompt && summaryPrompt.length > 8
        ? `The requestor provided this additional context on how to generate each item of this list: ${summaryPrompt}. `
        : "";

    const exampleOutput = llmSummaryListExamples.map((ex) => {
      return `
      Question: "${ex.question}",
      Responses:\n${ex.responses.map((r) => `- ${r}"`).join("\n")}
      Example output:\n
      ${JSON.stringify(ex.output)}\n`;
    });

    return `Your goal is to syntesize the key ideas contained in the totality of responses into a consise list. Group similar ideas from the responses into single items as much as possible. Each item should be a few words or a short phrase. The output should be a JSON with a single key ,"items", that has a value of an array of string list items. ${flowSummaryInstructions} \n\n ${`Here's an example of what this JSON list should look like:\n\n
    {
      "items": [
          "This is a description of a key idea from the responses",
          "This is a description of a key idea from the responses"
      ],
    }`}\n\n Here are some example of what the output should look like for a given question and set of responses:\n\n${exampleOutput.join("\n")}`;
  }
};
