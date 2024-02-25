import { ActionNewArgs, ActionNewType, FieldType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection, FieldSchemaType } from "../../formValidation/fields";
import { ActionSchemaType } from "../../formValidation/action";

export const createActionArgs = (
  action: ActionSchemaType,
  responseField: FieldSchemaType | undefined,
): ActionNewArgs => {
  if (action.type !== ActionNewType.None && action.filterOptionId) {
    let filterOptionIndex: number | null = null;
    if (action.filterOptionId !== DefaultOptionSelection.None.toString()) {
      if (!responseField || responseField.type !== FieldType.Options)
        throw Error("Missing option set for action filter");
      const options = responseField.optionsConfig.options;
      filterOptionIndex = options.findIndex((option) => option.optionId === action.filterOptionId);
      if (filterOptionIndex === -1) throw Error("Action filter option not found ");
    }
    delete action.filterOptionId;
    return { ...action, filterOptionIndex };
  }
  return action;
};
