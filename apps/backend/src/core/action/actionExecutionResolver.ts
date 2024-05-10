import { ActionExecution, ActionExecutionStatus } from "@/graphql/generated/resolver-types";
import { ActionExecutionPrismaType, ActionNewPrismaType } from "./actionPrismaTypes";

export const actionExecutionResolver = (
  actionExecutions: ActionExecutionPrismaType[],
  action: ActionNewPrismaType | null,
): ActionExecution | null => {
  if (!action) return null;

  const actionExecution = actionExecutions.find((ae) => action.id === ae.actionId);

  return {
    actionId: action.id,
    lastAttemptedAt: actionExecution?.lastAttemptedAt.toISOString() ?? null,
    status: !actionExecution
      ? ActionExecutionStatus.NotAttempted
      : actionExecution.complete
        ? ActionExecutionStatus.Completed
        : ActionExecutionStatus.Failure,
  };
};
