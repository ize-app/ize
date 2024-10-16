import dayjs from "dayjs";

import { Field, FieldDataType, FieldType } from "@/graphql/generated/graphql";

import {
  FieldOptionSchemaType,
  FieldSchemaType,
  FieldsSchemaType,
} from "../../formValidation/fields";

export const createFieldsFormState = (fields: Field[]): FieldsSchemaType => {
  return fields.map((field) => createFieldFormState(field));
};

const createFieldFormState = (field: Field): FieldSchemaType => {
  const { fieldId, name, required, isInternal } = field;
  switch (field.__typename) {
    case FieldType.FreeInput:
      return {
        type: FieldType.FreeInput,
        fieldId,
        name,
        required,
        isInternal,
        freeInputDataType: field.dataType,
      };
    case FieldType.Options:
      return {
        type: FieldType.Options,
        fieldId,
        name,
        isInternal,
        required,
        optionsConfig: {
          // array of resultConfig ids
          linkedResultOptions: field.linkedResultOptions.map((lr) => ({ id: lr.resultConfigId })),
          previousStepOptions: field.previousStepOptions,
          requestOptionsDataType: field.requestOptionsDataType ?? undefined,
          maxSelections: field.maxSelections,
          selectionType: field.selectionType,
          options: field.options.map(
            (o): FieldOptionSchemaType => ({
              optionId: o.optionId,
              name: createDataType(o.name, o.dataType),
              dataType: o.dataType,
            }),
          ),
        },
      };
    default:
      throw Error("Invalid field type");
  }
};

const createDataType = (value: string, dataType: FieldDataType) => {
  if (dataType === FieldDataType.Date || dataType === FieldDataType.DateTime) {
    return dayjs.utc(value);
  } else return value;
};
