import { stringifyResultGroups } from "@/core/request/stringify/stringifyResultGroups";
import { stringifyTriggerFields } from "@/core/request/stringify/stringifyTriggerFields";
import { Request } from "@/graphql/generated/resolver-types";

export const createRequestContextPrompt = ({
  request,
  requestStepId,
}: {
  request: Request;
  requestStepId: string;
}): string => {
  return `# Context about this request\n\nRequest name: [${request.flow.name}] ${request.name}\n\n
  ${stringifyTriggerFields({ request, title: "Request context", type: "markdown" })}\n\n
  ${stringifyResultGroups({ request, title: "Results so far", type: "markdown", excludeRequestStepId: requestStepId })}\n\n
  `;
};
