import { ActionExecution } from "@/graphql/generated/resolver-types";

import { ActionExecutionPrismaType, ActionNewPrismaType } from "./actionPrismaTypes";
import { getActionExecutionStatus } from "./getActionExecutionStatus";

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
    status: getActionExecutionStatus(actionExecution, requestFinal),
  };
};
