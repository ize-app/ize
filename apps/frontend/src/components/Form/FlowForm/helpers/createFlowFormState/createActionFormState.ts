import { UUIDRemapper } from "@/components/Form/utils/UUIDRemapper";
import { Action, ActionType } from "@/graphql/generated/graphql";

import { ActionFilterSchemaType, ActionSchemaType } from "../../formValidation/action";

export const createActionFormState = (
  action: Action | null | undefined,
  uuidRemapper: UUIDRemapper,
): ActionSchemaType | undefined => {
  if (!action) return undefined;

  const filter: ActionFilterSchemaType | undefined = action.filter
    ? {
        resultConfigId: uuidRemapper.getRemappedUUID(action.filter.resultConfigId),
        optionId: uuidRemapper.getRemappedUUID(action.filter.option.optionId),
      }
    : undefined;

  switch (action?.__typename) {
    case ActionType.CallWebhook:
      return {
        type: ActionType.CallWebhook,
        locked: action.locked,
        filter,
        callWebhook: {
          webhookId: action.webhookId,
          name: action.webhookName,
          originalUri: action.uri,
          uri: action.uri,
          valid: true,
        },
      };
    case ActionType.TriggerStep:
      return {
        type: ActionType.TriggerStep,
        locked: action.locked,
        filter,
      };
    case ActionType.EvolveFlow:
      return {
        type: ActionType.EvolveFlow,
        locked: action.locked,
        filter,
      };
    case ActionType.EvolveGroup:
      return {
        type: ActionType.EvolveGroup,
        locked: action.locked,
        filter,
      };
    case ActionType.GroupWatchFlow: {
      return {
        type: ActionType.GroupWatchFlow,
        locked: action.locked,
        filter,
      };
    }
    default:
      throw new Error(`Unknown action type: ${action?.__typename}`);
  }
};
