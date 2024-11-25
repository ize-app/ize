import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import { ActionType } from "@/graphql/generated/graphql";

// Define a union type for all possible arguments with a discriminant 'type' field
type ActionArg =
  | {
      type: ActionType.TriggerStep;
      nextStepId: string;
    }
  | {
      type: ActionType.CallWebhook;
      webhookName: string;
      filterOptionId: string | null;
      filterResultConfigId: string | null;
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
        filter: undefined,
        stepId: arg.nextStepId,
      };
    case ActionType.CallWebhook: {
      const { webhookName, filterOptionId, filterResultConfigId } = arg;
      return {
        type: ActionType.CallWebhook,
        ...base,
        filter:
          filterOptionId && filterResultConfigId
            ? {
                optionId: filterOptionId,
                resultConfigId: filterResultConfigId,
              }
            : undefined,
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
