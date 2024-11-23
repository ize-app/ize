import { FieldArgs, FieldOptionsConfigArgs, FieldType } from "@/graphql/generated/graphql";

import { FieldSchemaType, FieldsSchemaType } from "../../formValidation/fields";

export const createFieldsArgs = (fields: FieldsSchemaType): FieldArgs[] => {
  return (fields ?? []).map((field): FieldArgs => {
    return createFieldArgs(field);
  });
};

export const createFieldArgs = (field: FieldSchemaType): FieldArgs => {
  if (field.type === FieldType.FreeInput) {
    const { fieldId, required, name, type, freeInputDataType, systemType, isInternal } = field;
    return {
      type,
      isInternal,
      fieldId,
      systemType,
      freeInputDataType,
      required,
      name,
    };
  } else if (field.type === FieldType.Options) {
    const {
      fieldId,
      isInternal,
      required,
      name,
      type,
      systemType,
      optionsConfig: rawOptionsConfig,
    } = field;

    const { selectionType, maxSelections, previousStepOptions } = rawOptionsConfig;

    const optionsConfig: FieldOptionsConfigArgs = {
      selectionType,
      maxSelections,
      previousStepOptions,
      requestOptionsDataType: rawOptionsConfig.triggerDefinedOptions?.dataType ?? null,
      options: rawOptionsConfig.options.map((option) => {
        return {
          ...option,
          //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          name: option.name,
        };
      }),
      linkedResultOptions: rawOptionsConfig.linkedResultOptions.map(
        (linkedResult) => linkedResult.id,
      ),
    };

    return {
      type,
      fieldId,
      isInternal,
      systemType,
      required,
      name,
      optionsConfig,
    };
  } else {
    throw Error("Unknown option type");
  }
};
