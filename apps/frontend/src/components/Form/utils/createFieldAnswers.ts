import { Dayjs } from "dayjs";

import { FieldAnswerArgs } from "@/graphql/generated/graphql";

import { FieldAnswerRecordSchemaType, FieldAnswerSchemaType } from "../formValidation/field";

export const createFieldAnswersArgs = (
  fieldAnswers: FieldAnswerRecordSchemaType | undefined,
): FieldAnswerArgs[] => {
  return Object.entries((fieldAnswers ?? []) as FieldAnswerRecordSchemaType)
    .map(
      (entry): FieldAnswerArgs => ({
        fieldId: entry[0],
        value: formatAnswerValue(entry[1]),
        optionSelections: entry[1].optionSelections ?? [],
      }),
    )
    .filter((f) => f.value || (f.optionSelections ?? []).length > 0);
};

const formatAnswerValue = (fieldAnswer: FieldAnswerSchemaType) => {
  if (fieldAnswer.value) {
    switch (fieldAnswer.dataType) {
      case "Date":
        const date = fieldAnswer.value as Dayjs;
        return date.utc().format("YYYY-MM-DD"); // 2019-03-06
      case "DateTime":
        const datetime = fieldAnswer.value as Dayjs;
        return datetime.utc().format(); // 2019-03-06T00:00:00Z
      default:
        return fieldAnswer.value;
    }
  }
  return null;
};
