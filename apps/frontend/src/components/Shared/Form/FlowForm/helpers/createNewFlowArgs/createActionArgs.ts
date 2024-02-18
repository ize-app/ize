import { ActionNewArgs, ActionNewType, FieldType } from "@/graphql/generated/graphql";
import { FieldSchemaType } from "../../formValidation/fields";
import { ActionSchemaType } from "../../formValidation/action";

export const createActionArgs = (
  action: ActionSchemaType,
  responseField: FieldSchemaType | undefined,
): ActionNewArgs => {
  if (action.type !== ActionNewType.None && action.filterOptionId) {
    if (!responseField || responseField.type !== FieldType.Options) throw Error();
    const options = responseField.optionsConfig.options;
    let filterOptionIndex: number = options.findIndex(
      (option) => option.optionId === action.filterOptionId,
    );
    if (filterOptionIndex === -1) throw Error("Action filter option not found ");
    delete action.filterOptionId;
    return { ...action, filterOptionIndex };
  }
  return action;
};
