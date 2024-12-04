import { createInputValueFormState } from "@/components/Form/InputField/createFormState/createInputFormState";
import { OptionSchemaType } from "@/components/Form/InputField/inputValidation";
import { UUIDRemapper } from "@/components/Form/utils/UUIDRemapper";
import { FieldFragment, ValueType } from "@/graphql/generated/graphql";

import { FieldSchemaType, FieldsSchemaType } from "../../formValidation/fields";

export const createFieldsFormState = (
  fields: FieldFragment[],
  uuidRemapper: UUIDRemapper,
): FieldsSchemaType => {
  return fields.map((field) => createFieldFormState(field, uuidRemapper));
};

const createFieldFormState = (
  field: FieldFragment,
  uuidRemapper: UUIDRemapper,
): FieldSchemaType => {
  const {
    fieldId: oldFieldId,
    name,
    required,
    isInternal,
    systemType,
    type,
    optionsConfig,
  } = field;

  const fieldId = uuidRemapper.remapId(oldFieldId);

  if (type === ValueType.OptionSelections) {
    if (!optionsConfig) throw Error("OptionSelections field must have optionsConfig");
    return {
      type,
      fieldId,
      name,
      required,
      systemType,
      isInternal,
      optionsConfig: {
        // array of resultConfig ids
        linkedResultOptions: optionsConfig.linkedResultOptions.map((lr) => ({
          id: uuidRemapper.getRemappedUUID(lr.resultConfigId),
        })),
        triggerDefinedOptions: optionsConfig.triggerOptionsType
          ? { hasTriggerDefinedOptions: true, type: optionsConfig.triggerOptionsType }
          : { hasTriggerDefinedOptions: false, type: null },
        maxSelections: optionsConfig.maxSelections ?? null,
        selectionType: optionsConfig.selectionType,
        options: optionsConfig.options.map(
          (o): OptionSchemaType => ({
            optionId: uuidRemapper.remapId(o.optionId),
            //@ts-expect-error Typechecking broken here, not sure why
            input: createInputValueFormState({
              type: "optionValue",
              value: o.value,
            }),
          }),
        ),
      },
    };
  } else {
    return {
      type,
      fieldId,
      name,
      required,
      systemType,
      isInternal,
    };
  }
};
