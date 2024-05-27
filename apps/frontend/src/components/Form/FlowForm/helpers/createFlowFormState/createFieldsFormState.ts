import { Field, FieldType } from "@/graphql/generated/graphql";

import {
  FieldOptionSchemaType,
  FieldOptionsSchemaType,
  FieldSchemaType,
  FieldsSchemaType,
} from "../../formValidation/fields";

export const createFieldsFormState = (fields: Field[]): FieldsSchemaType => {
  return fields.map((field) => createFieldFormState(field));
};

const createFieldFormState = (field: Field): FieldSchemaType => {
  const { fieldId, name, required } = field;
  switch (field.__typename) {
    case FieldType.FreeInput:
      return {
        type: FieldType.FreeInput,
        fieldId,
        name,
        required,
        freeInputDataType: field.dataType,
      };
    case FieldType.Options:
      const optionsConfig: FieldOptionsSchemaType = {
        // array of resultConfig ids
        linkedResultOptions: field.linkedResultOptions.map((lr) => ({ id: lr.resultConfigId })),
        previousStepOptions: field.previousStepOptions,
        hasRequestOptions: field.hasRequestOptions,
        requestOptionsDataType: field.requestOptionsDataType ?? undefined,
        maxSelections: field.maxSelections,
        selectionType: field.selectionType,
        options: field.options.map(
          (o): FieldOptionSchemaType => ({
            optionId: o.optionId,
            name: o.name,
            dataType: o.dataType,
          }),
        ),
      };
      return { type: FieldType.Options, fieldId, name, required, optionsConfig };
    default:
      throw Error("Invalid field type");
  }
};
