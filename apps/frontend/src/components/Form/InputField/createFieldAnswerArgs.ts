import {
  Entity,
  FieldAnswerArgs,
  FieldDataType,
  FieldType,
  FlowSummaryFragment,
} from "@/graphql/generated/graphql";

import { InputRecordSchemaType, InputSchemaType } from "../formValidation/field";

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
          value: formatInputValue(entry[1]),
        };
      }
    },
  );

  return res.filter((f) => !!f);
};

const formatInputValue = (input: InputSchemaType) => {
  if (input.value) {
    switch (input.type) {
      case FieldDataType.String:
        return input.value;
      case FieldDataType.Uri:
        return input.value;
      case FieldDataType.Date:
        return input.value.utc().format("YYYY-MM-DD"); // 2019-03-06
      case FieldDataType.Number:
        return input.value.toString();
      case FieldDataType.DateTime:
        return input.value.utc().format(); // 2019-03-06T00:00:00Z
      case FieldDataType.EntityIds:
        return JSON.stringify((input.value as Entity[]).map((e) => e.entityId));
      case FieldDataType.FlowIds:
        return JSON.stringify((input.value as FlowSummaryFragment[]).map((f) => f.flowId));
      case FieldDataType.FlowVersionId:
        return input.value;
    }
  }
  return null;
};
