import { RequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { stringifyResultGroups } from "@/core/request/stringify/stringifyResultGroups";
import { stringifyTriggerFields } from "@/core/request/stringify/stringifyTriggerFields";

export const createRequestContextPrompt = ({
  requestPayload,
}: {
  requestPayload: RequestPayload;
}): string => {
  const { flowName, requestName, results, requestTriggerAnswers } = requestPayload;

  return `Here is context about the results from this request so far \n\nRequest name: [${flowName}] ${requestName}\n\n
  **Request context**: \n\n
  ${stringifyTriggerFields({ triggerFields: requestTriggerAnswers, type: "markdown" })} \n\n
  **Results so far**: \n\n
  ${stringifyResultGroups({ results, type: "markdown" })} \n\n
  `;
};
