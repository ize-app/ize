import { createOptionsArgs } from "@/components/Form/InputField/createMutationArgs/createOptionsArgs";
import { FieldArgs, FieldOptionsConfigArgs, ValueType } from "@/graphql/generated/graphql";

import { FieldSchemaType, FieldsSchemaType } from "../../formValidation/fields";

export const createFieldsArgs = (fields: FieldsSchemaType): FieldArgs[] => {
  return (fields ?? []).map((field): FieldArgs => {
    return createFieldArgs(field);
  });
};

export const createFieldArgs = (field: FieldSchemaType): FieldArgs => {
  let optionsConfig: FieldOptionsConfigArgs | undefined;
  const { fieldId, required, name, type, systemType, isInternal } = field;

  if (field.type === ValueType.OptionSelections) {
    const { selectionType, maxSelections, triggerDefinedOptions, linkedResultOptions, options } =
      field.optionsConfig;

    optionsConfig = {
      selectionType,
      maxSelections,
      triggerOptionsType: triggerDefinedOptions?.type ?? null,
      options: createOptionsArgs(options),
      linkedResultOptions: linkedResultOptions.map((linkedResult) => linkedResult.id),
    };
  }

  return {
    type,
    fieldId,
    required,
    name,
    systemType,
    isInternal,
    optionsConfig,
  };
};
