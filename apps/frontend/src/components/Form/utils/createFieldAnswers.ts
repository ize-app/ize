import { FieldAnswerArgs } from "@/graphql/generated/graphql";
import { FieldAnswerSchemaType } from "../formValidation/field";

export const createFieldAnswersArgs = (
  fieldAnswers: FieldAnswerSchemaType | undefined,
): FieldAnswerArgs[] => {
  return Object.entries((fieldAnswers ?? []) as FieldAnswerSchemaType)
    .map(
      (entry): FieldAnswerArgs => ({
        fieldId: entry[0],
        value: entry[1].value ? entry[1].value.toString() : null,
        optionSelections: entry[1].optionSelections ?? [],
      }),
    )
    .filter((f) => f.value || (f.optionSelections ?? []).length > 0);
};
