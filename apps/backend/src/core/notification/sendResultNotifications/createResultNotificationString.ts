import { stringifyResultGroups } from "@/core/request/stringify/stringifyResultGroups";
import { ActionStatus, Request } from "@/graphql/generated/resolver-types";

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
    type: "html",
    requestStepId,
  });

  const stepId = request.requestSteps.find((rs) => rs.requestStepId === requestStepId)?.stepId;
  const action = request.flow.steps.find((step) => step.id === stepId)?.action;
  const actionExecution = request.requestSteps.find(
    (rs) => rs.requestStepId === requestStepId,
  )?.actionExecution;
  let executingAction = false;

  if (
    actionExecution &&
    [
      ActionStatus.Attempting,
      ActionStatus.Error,
      ActionStatus.Complete,
      ActionStatus.NotStarted,
    ].includes(actionExecution?.status)
  ) {
    executingAction = true;
  }

  const actionString =
    action && executingAction ? `\n\n<i>⚡ Triggering action: ${action.name}</i>` : "";

  return `${resultsString}${actionString}`;
};
