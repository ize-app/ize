import { ActionExecution } from "@/graphql/generated/resolver-types";

import { ActionConfigPrismaType, ActionPrismaType } from "./actionPrismaTypes";
import { getActionStatus } from "./getActionStatus";

export const actionResolver = ({
  action,
  actionConfig: actionConfig,
  resultsFinal,
  actionsFinal,
}: {
  action: ActionPrismaType[];
  actionConfig: ActionConfigPrismaType | null | undefined;
  resultsFinal: boolean;
  actionsFinal: boolean;
}): ActionExecution | null => {
  if (!actionConfig) return null;

  const actionExecution = action.find((ae) => actionConfig.id === ae.actionConfigId);

  return {
    actionId: actionConfig.id,
    lastAttemptedAt: actionExecution?.lastAttemptedAt.toISOString() ?? null,
    status: getActionStatus({
      action: actionExecution,
      actionConfig: actionConfig,
      resultsFinal,
      actionsFinal,
    }),
  };
};
