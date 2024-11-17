import { FieldFragment, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { createFreeInputDefaultValue } from "./createFreeInputDefaultState";
import {
  FieldAnswerRecordSchemaType,
  FieldAnswerSchemaType,
  OptionSelectionsSchemaType,
} from "../formValidation/field";

export const createFieldAnswersFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): FieldAnswerRecordSchemaType => {
  const responseFieldAnswers: FieldAnswerRecordSchemaType = {};
  fields.map((f) => {
    let answer: FieldAnswerSchemaType;
    if (f.__typename === FieldType.FreeInput) {
      const defaultValue = createFreeInputDefaultValue({
        defaultValue: f?.defaultAnswer,
        dataType: f.dataType,
      });
      answer = {
        dataType: f.dataType,
        required: f.required,
        value: defaultValue,
      };
    } else {
      let optionSelections: OptionSelectionsSchemaType = [];
      if (f.selectionType === FieldOptionsSelectionType.Rank) optionSelections = f.options;
      answer = {
        required: f.required,
        selectionType: f.selectionType,
        maxSelections: f.maxSelections,
        optionSelections,
      };
    }
    responseFieldAnswers[f.fieldId] = answer;
  });

  return responseFieldAnswers;
};
