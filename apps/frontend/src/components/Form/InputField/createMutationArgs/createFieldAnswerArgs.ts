import { FieldAnswerArgs, OptionSelectionType, ValueType } from "@/graphql/generated/graphql";

import { createInputValueArg } from "./createInputValueArg";
import { InputRecordSchemaType } from "../inputValidation";

export const createFieldAnswersArgs = (
  fieldAnswers: InputRecordSchemaType | undefined,
): FieldAnswerArgs[] => {
  const res = Object.entries((fieldAnswers ?? []) as InputRecordSchemaType).map(
    (entry): FieldAnswerArgs | null => {
      if (entry[1].value === "") return null;
      else if (entry[1].value === undefined) return null;
      else if (entry[1].value === null) return null;
      else if (Array.isArray(entry[1].value) && entry[1].value.length === 0) return null;
      else if (entry[1].type === ValueType.Uri && !entry[1].value.uri) return null;
      if (entry[1].type === ValueType.OptionSelections) {
        const selectionCount = entry[1].value.length;
        const selectionType = entry[1].selectionType;

        if (!selectionCount) return null;
        return {
          fieldId: entry[0],
          optionSelections: entry[1].value.map((v, index) => ({
            optionId: v.optionId,
            weight: selectionType === OptionSelectionType.Rank ? selectionCount - index : 1,
          })),
        };
      } else {
        return {
          fieldId: entry[0],
          value: createInputValueArg(entry[1]),
        };
      }
    },
  );

  return res.filter((f) => !!f);
};
