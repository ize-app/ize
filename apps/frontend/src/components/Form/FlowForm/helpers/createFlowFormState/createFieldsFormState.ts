import dayjs from "dayjs";

import { UUIDRemapper } from "@/components/Form/utils/UUIDRemapper";
import { Field, FieldDataType, FieldType } from "@/graphql/generated/graphql";

import {
  FieldOptionSchemaType,
  FieldSchemaType,
  FieldsSchemaType,
} from "../../formValidation/fields";

export const createFieldsFormState = (
  fields: Field[],
  uuidRemapper: UUIDRemapper,
): FieldsSchemaType => {
  return fields.map((field) => createFieldFormState(field, uuidRemapper));
};

const createFieldFormState = (field: Field, uuidRemapper: UUIDRemapper): FieldSchemaType => {
  const { fieldId: oldFieldId, name, required, isInternal, systemType } = field;

  const fieldId = uuidRemapper.remapId(oldFieldId);

  switch (field.__typename) {
    case FieldType.FreeInput:
      return {
        type: FieldType.FreeInput,
        fieldId,
        name,
        required,
        systemType,
        isInternal,
        freeInputDataType: field.dataType,
      };
    case FieldType.Options:
      return {
        type: FieldType.Options,
        fieldId,
        name,
        isInternal,
        systemType,
        required,
        optionsConfig: {
          // array of resultConfig ids
          linkedResultOptions: field.linkedResultOptions.map((lr) => ({
            id: uuidRemapper.getRemappedUUID(lr.resultConfigId),
          })),
          previousStepOptions: field.previousStepOptions,
          triggerDefinedOptions: field.requestOptionsDataType
            ? { hasTriggerDefinedOptions: true, dataType: field.requestOptionsDataType }
            : { hasTriggerDefinedOptions: false, dataType: null },
          maxSelections: field.maxSelections,
          selectionType: field.selectionType,
          options: field.options.map(
            (o): FieldOptionSchemaType => ({
              optionId: uuidRemapper.remapId(o.optionId),
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
