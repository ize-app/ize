import { stringifyResultGroups } from "@/core/request/stringify/stringifyResultGroups";
import { Request } from "@/graphql/generated/resolver-types";

export const createTelegramResultsString = ({
  request,
  requestStepId,
}: {
  request: Request;
  requestStepId: string;
}): string => {
  const resultsString = stringifyResultGroups({
    title: `New results in Ize 👀 for "${request.name}"`,
    request,
    type: "markdown",
    requestStepId,
  });

  const stepId = request.requestSteps.find((rs) => rs.requestStepId === requestStepId)?.stepId;
  const action = request.flow.steps.find((step) => step.id === stepId)?.action;

  const actionString = action ? `\n\n<i>⚡ Triggering action: ${action.name}</i>` : "";

  return `${resultsString}${actionString}`;
};
