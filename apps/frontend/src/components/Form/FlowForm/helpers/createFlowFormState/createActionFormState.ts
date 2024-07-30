import { Action, ActionType } from "@/graphql/generated/graphql";

import { ActionSchemaType } from "../../formValidation/action";
import { DefaultOptionSelection } from "../../formValidation/fields";

export const createActionFormState = (action: Action | null | undefined): ActionSchemaType => {
  if (!action)
    return {
      type: ActionType.None,
    };

  switch (action?.__typename) {
    case ActionType.CallWebhook:
      return {
        type: ActionType.CallWebhook,
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
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    case ActionType.EvolveFlow:
      return {
        type: ActionType.EvolveFlow,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    case ActionType.GroupUpdateMembership: {
      return {
        type: ActionType.GroupUpdateMembership,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    case ActionType.GroupWatchFlow: {
      return {
        type: ActionType.GroupWatchFlow,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    case ActionType.GroupUpdateMetadata: {
      return {
        type: ActionType.GroupUpdateMetadata,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    }
    default:
      throw new Error(`Unknown action type: ${action?.__typename}`);
  }
};
