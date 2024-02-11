import { FieldsSchemaType, FieldSchemaType } from "../../formValidation/fields";
import { FieldArgs, FieldType } from "@/graphql/generated/graphql";

export const createFieldsArgs = (fields: FieldsSchemaType): FieldArgs[] => {
  return (fields ?? []).map((field): FieldArgs => {
    return createFieldArgs(field);
  });
};

export const createFieldArgs = (field: FieldSchemaType): FieldArgs => {
  if (field.type === FieldType.FreeInput) {
    const { fieldId, required, name, type, freeInputDataType } = field;
    return {
      type,
      fieldId,
      freeInputDataType,
      required,
      name,
    };
  } else if (field.type === FieldType.Options) {
    const { fieldId, required, name, type, optionsConfig } = field;
    return {
      type,
      fieldId,
      required,
      name,
      optionsConfig,
    };
  } else {
    throw Error("Unknown option type");
  }
};
