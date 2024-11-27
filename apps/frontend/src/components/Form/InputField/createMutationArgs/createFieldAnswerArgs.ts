import { FieldAnswerArgs, FieldType } from "@/graphql/generated/graphql";

import { createInputValueArg } from "./createInputValueArg";
import { InputRecordSchemaType } from "../inputValidation";

export const createFieldAnswersArgs = (
  fieldAnswers: InputRecordSchemaType | undefined,
): FieldAnswerArgs[] => {
  const res = Object.entries((fieldAnswers ?? []) as InputRecordSchemaType).map(
    (entry): FieldAnswerArgs | null => {
      if (entry[1].type === FieldType.Options) {
        if (entry[1].value.length === 0) return null;
        return {
          fieldId: entry[0],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          optionSelections: entry[1].value,
        };
      } else {
        if (entry[1].value === undefined) return null;
        return {
          fieldId: entry[0],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: createInputValueArg(entry[1]),
        };
      }
    },
  );

  return res.filter((f) => !!f);
};
