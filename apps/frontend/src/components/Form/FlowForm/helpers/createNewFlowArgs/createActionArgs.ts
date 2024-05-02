import { ActionArgs, ActionType, FieldType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection, FieldsSchemaType } from "../../formValidation/fields";
import { ActionSchemaType } from "../../formValidation/action";

export const createActionArgs = (
  action: ActionSchemaType,
  responseFields: FieldsSchemaType | undefined,
): ActionArgs => {
  if (action.type !== ActionType.None && action.filterOptionId) {
    let filterOptionIndex: number | null = null;
    let filterResponseFieldIndex: number | null = null;
    if (action.filterOptionId !== DefaultOptionSelection.None.toString()) {
      (responseFields ?? []).forEach((f, fieldIndex) => {
        if (f.type === FieldType.Options) {
          const optionIndex = f.optionsConfig.options.findIndex((o) => {
            return o.optionId === action.filterOptionId;
          });
          if (optionIndex !== -1) {
            filterOptionIndex = optionIndex;
            filterResponseFieldIndex = fieldIndex;
          }
        }
      });
      if (typeof filterOptionIndex !== "number") {
        throw Error("Action filter option not found ");
      }
    }
    //@ts-ignore
    delete action.filterOptionId;
    return { ...action, filterOptionIndex, filterResponseFieldIndex };
  }
  return action;
};
