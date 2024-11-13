import {
  FieldAnswer,
  FieldDataType,
  FieldFragment,
  FieldOptionsSelectionType,
  FieldType,
} from "@/graphql/generated/graphql";

import {
  FieldAnswerRecordSchemaType,
  FieldAnswerSchemaType,
  OptionSelectionsSchemaType,
} from "./formValidation/field";

// TODO revisit this
const getFreeInputDefaultValue = (
  defaultValue: FieldAnswer | undefined | null,
  dataType: FieldDataType,
) => {
  if (defaultValue)
    switch (defaultValue.__typename) {
      case "EntitiesFieldAnswer":
        return defaultValue.entities;
      case "FlowsFieldAnswer":
        return defaultValue.flows;
      case "FreeInputFieldAnswer":
        return defaultValue.value;
      case "WebhookFieldAnswer":
        return defaultValue;
      case "OptionFieldAnswer":
        return defaultValue.selections;
      default:
        return "";
    }
  else
    switch (dataType) {
      // case FieldDataType.Date:
      //   return new Date();
      // case FieldDataType.DateTime:
      //   return new Date();
      case FieldDataType.EntityIds:
        return [];
      case FieldDataType.FlowIds:
        return [];
      case FieldDataType.Number:
        return "";
      case FieldDataType.String:
        return "";
      default:
        return "";
    }
};

export const createFieldAnswersFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): FieldAnswerRecordSchemaType => {
  const responseFieldAnswers: FieldAnswerRecordSchemaType = {};
  fields.map((f) => {
    let answer: FieldAnswerSchemaType;
    if (f.__typename === FieldType.FreeInput) {
      const defaultValue = getFreeInputDefaultValue(f?.defaultAnswer, f.dataType);
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
