import { ActionStatus } from "@/graphql/generated/resolver-types";

import { ActionConfigPrismaType, ActionExecutionPrismaType } from "./actionPrismaTypes";

export const getActionExecutionStatus = ({
  actionExecution,
  action,
  resultsFinal,
  actionsFinal,
}: {
  actionExecution: ActionExecutionPrismaType | undefined | null;
  action: ActionConfigPrismaType;
  resultsFinal: boolean;
  actionsFinal: boolean;
}): ActionStatus => {
  if (!resultsFinal) return ActionStatus.NotStarted;

  if (actionsFinal) {
    if (!actionExecution) {
      if (action.ActionConfigFilter) return ActionStatus.DidNotPassFilter;
      else return ActionStatus.NotStarted;
    } else {
      if (actionExecution.complete) return ActionStatus.Complete;
      else return ActionStatus.Error;
    }
  } else {
    return ActionStatus.Attempting;
  }
};
