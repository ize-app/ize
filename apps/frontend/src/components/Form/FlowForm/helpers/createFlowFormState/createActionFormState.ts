import { Action, ActionType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "../../formValidation/fields";
import { ActionSchemaType } from "../../formValidation/action";

export const createActionFormState = (action: Action | null | undefined): ActionSchemaType => {
  switch (action?.__typename) {
    case ActionType.CallWebhook:
      return {
        type: ActionType.CallWebhook,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
        callWebhook: {
          name: action.name,
          uri: action.uri,
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
