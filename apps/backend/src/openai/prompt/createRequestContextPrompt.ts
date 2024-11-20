import { RequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { stringifyResultGroups } from "@/core/request/stringify/stringifyResultGroups";
import { stringifyTriggerFields } from "@/core/request/stringify/stringifyTriggerFields";

export const createRequestContextPrompt = ({
  requestPayload,
  resultConfigId,
}: {
  requestPayload: RequestPayload;
  resultConfigId: string;
}): string => {
  const { flowName, requestName, results, requestTriggerAnswers } = requestPayload;
  // don't include current pending result in result list
  const filteredResults = results.filter((result) => result.resultConfigId !== resultConfigId);

  return `Here is context about the results from this request so far \n\nRequest name: [${flowName}] ${requestName}\n\n
  **Request context**: \n\n
  ${stringifyTriggerFields({ triggerFields: requestTriggerAnswers, type: "markdown" })} \n\n
  **Results so far**: \n\n
  ${stringifyResultGroups({ results: filteredResults, type: "markdown" })} \n\n
  `;
};
