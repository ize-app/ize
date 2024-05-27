import { Action, ActionType } from "@/graphql/generated/graphql";

import { ActionSchemaType } from "../../formValidation/action";
import { DefaultOptionSelection } from "../../formValidation/fields";

export const createActionFormState = (action: Action | null | undefined): ActionSchemaType => {
  switch (action?.__typename) {
    case ActionType.CallWebhook:
      return {
        type: ActionType.CallWebhook,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
        callWebhook: {
          name: action.name,
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
    default:
      return {
        type: ActionType.None,
      };
  }
};
