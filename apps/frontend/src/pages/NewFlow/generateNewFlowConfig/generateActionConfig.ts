import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import { DefaultOptionSelection } from "@/components/Form/FlowForm/formValidation/fields";
import { ActionType } from "@/graphql/generated/graphql";

// Define a union type for all possible arguments with a discriminant 'type' field
type ActionArg =
  | {
      type: ActionType.TriggerStep;
    }
  | {
      type: ActionType.CallWebhook;
      webhookName: string;
      filterOptionId: string | null;
    };

// A single function that uses discriminated unions
export function generateActionConfig(arg: ActionArg): ActionSchemaType {
  const base = {
    locked: false,
  };

  switch (arg.type) {
    case ActionType.TriggerStep:
      return {
        type: ActionType.TriggerStep,
        ...base,
        filterOptionId: null,
      };
    case ActionType.CallWebhook: {
      const { webhookName, filterOptionId } = arg;
      return {
        type: ActionType.CallWebhook,
        ...base,
        filterOptionId: filterOptionId ?? DefaultOptionSelection.None,
        callWebhook: {
          name: webhookName,
          uri: "",
          valid: false,
        },
      };
    }
    default:
      throw new Error("Invalid ActionType");
  }
}
