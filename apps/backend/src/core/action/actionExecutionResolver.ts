import { ActionExecution } from "@/graphql/generated/resolver-types";

import { ActionConfigPrismaType, ActionExecutionPrismaType } from "./actionPrismaTypes";
import { getActionExecutionStatus } from "./getActionExecutionStatus";

export const actionExecutionResolver = ({
  actionExecutions,
  action,
  resultsFinal,
  actionsFinal,
}: {
  actionExecutions: ActionExecutionPrismaType[];
  action: ActionConfigPrismaType | null | undefined;
  resultsFinal: boolean;
  actionsFinal: boolean;
}): ActionExecution | null => {
  if (!action) return null;

  const actionExecution = actionExecutions.find((ae) => action.id === ae.actionConfigId);

  return {
    actionId: action.id,
    lastAttemptedAt: actionExecution?.lastAttemptedAt.toISOString() ?? null,
    status: getActionExecutionStatus({ actionExecution, action, resultsFinal, actionsFinal }),
  };
};
