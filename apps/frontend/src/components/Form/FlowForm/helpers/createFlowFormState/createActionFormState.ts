import { Action, ActionType } from "@/graphql/generated/graphql";

import { ActionSchemaType } from "../../formValidation/action";
import { DefaultOptionSelection } from "../../formValidation/fields";

export const createActionFormState = (action: Action | null | undefined): ActionSchemaType => {
  if (!action)
    return {
      type: ActionType.None,
      locked: false,
    };

  switch (action?.__typename) {
    case ActionType.CallWebhook:
      return {
        type: ActionType.CallWebhook,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
        callWebhook: {
          webhookId: action.webhookId,
          name: action.name,
          originalUri: action.uri,
          uri: action.uri,
          valid: true,
        },
      };
    case ActionType.TriggerStep:
      return {
        type: ActionType.TriggerStep,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    case ActionType.EvolveFlow:
      return {
        type: ActionType.EvolveFlow,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    case ActionType.GroupUpdateMembership: {
      return {
        type: ActionType.GroupUpdateMembership,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    case ActionType.GroupWatchFlow: {
      return {
        type: ActionType.GroupWatchFlow,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    case ActionType.GroupUpdateMetadata: {
      return {
        type: ActionType.GroupUpdateMetadata,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    case ActionType.GroupUpdateNotifications: {
      return {
        type: ActionType.GroupUpdateNotifications,
        locked: action.locked,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    default:
      throw new Error(`Unknown action type: ${action?.__typename}`);
  }
};
