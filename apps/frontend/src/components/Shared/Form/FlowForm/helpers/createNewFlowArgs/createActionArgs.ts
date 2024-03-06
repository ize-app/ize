import { ActionNewArgs, ActionNewType, FieldType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection, FieldsSchemaType } from "../../formValidation/fields";
import { ActionSchemaType } from "../../formValidation/action";

export const createActionArgs = (
  action: ActionSchemaType,
  responseFields: FieldsSchemaType | undefined,
): ActionNewArgs => {
  if (action.type !== ActionNewType.None && action.filterOptionId) {
    let filterOptionIndex: number | null = null;
    let filterResponseFieldIndex: number | null = null;
    if (action.filterOptionId !== DefaultOptionSelection.None.toString()) {
      (responseFields ?? []).forEach((f, fieldIndex) => {
        if (f.type === FieldType.Options) {
          const optionIndex = f.optionsConfig.options.findIndex(
            (o) => o.optionId === action.filterOptionId,
          );
          if (optionIndex) {
            filterOptionIndex = optionIndex;
            filterResponseFieldIndex = fieldIndex;
          }
        }
      });
      if (action.filterOptionId && !filterOptionIndex)
        throw Error("Action filter option not found ");
    }
    //@ts-ignore
    delete action.filterOptionId;
    return { ...action, filterOptionIndex, filterResponseFieldIndex };
  }
  return action;
};
