import { ActionExecution } from "@/graphql/generated/resolver-types";

import { ActionExecutionPrismaType, ActionNewPrismaType } from "./actionPrismaTypes";
import { getActionExecutionStatus } from "./getActionExecutionStatus";

export const actionExecutionResolver = ({
  actionExecutions,
  action,
  resultsFinal,
  actionsFinal,
}: {
  actionExecutions: ActionExecutionPrismaType[];
  action: ActionNewPrismaType | null;
  resultsFinal: boolean;
  actionsFinal: boolean;
}): ActionExecution | null => {
  if (!action) return null;

  action.filterOptionId;

  const actionExecution = actionExecutions.find((ae) => action.id === ae.actionId);

  return {
    actionId: action.id,
    lastAttemptedAt: actionExecution?.lastAttemptedAt.toISOString() ?? null,
    status: getActionExecutionStatus({ actionExecution, action, resultsFinal, actionsFinal }),
  };
};
