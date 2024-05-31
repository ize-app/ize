import { ActionExecution, Status } from "@/graphql/generated/resolver-types";

import { ActionExecutionPrismaType, ActionNewPrismaType } from "./actionPrismaTypes";

export const actionExecutionResolver = (
  actionExecutions: ActionExecutionPrismaType[],
  action: ActionNewPrismaType | null,
  requestFinal: boolean,
): ActionExecution | null => {
  if (!action) return null;

  const actionExecution = actionExecutions.find((ae) => action.id === ae.actionId);

  return {
    actionId: action.id,
    lastAttemptedAt: actionExecution?.lastAttemptedAt.toISOString() ?? null,
    status: determineActionStatus(actionExecution, requestFinal),
  };
};

const determineActionStatus = (
  actionExecution: ActionExecutionPrismaType | undefined,
  requestFinal: boolean,
) => {
  if (actionExecution && actionExecution.complete) return Status.Completed;
  else if (actionExecution && !actionExecution.complete) return Status.Failure;
  else if (!actionExecution && requestFinal) return Status.Cancelled;
  else return Status.NotAttempted;
};
