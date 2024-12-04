import { ActionStatus } from "@/graphql/generated/resolver-types";

import { ActionConfigPrismaType, ActionPrismaType } from "./actionPrismaTypes";

export const getActionStatus = ({
  action,
  actionConfig,
  resultsFinal,
  actionsFinal,
}: {
  action: ActionPrismaType | undefined | null;
  actionConfig: ActionConfigPrismaType;
  resultsFinal: boolean;
  actionsFinal: boolean;
}): ActionStatus => {
  if (!resultsFinal) return ActionStatus.NotStarted;

  if (actionsFinal) {
    if (!action) {
      if (actionConfig.ActionConfigFilter) return ActionStatus.DidNotPassFilter;
      else return ActionStatus.NotStarted;
    } else {
      if (action.complete) return ActionStatus.Complete;
      else return ActionStatus.Error;
    }
  } else {
    return ActionStatus.Attempting;
  }
};
