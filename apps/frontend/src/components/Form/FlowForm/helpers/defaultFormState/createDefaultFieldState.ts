import { OptionSelectionType, ValueType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";

interface DefaultFieldProps {
  type: ValueType;
  selectionType?: OptionSelectionType;
}

export const createDefaultFieldState = (props: DefaultFieldProps): FieldSchemaType => {
  if (props.type === ValueType.OptionSelections) {
    return {
      fieldId: crypto.randomUUID(),
      type: ValueType.OptionSelections,
      name: "",
      isInternal: false,
      required: true,
      optionsConfig: {
        options: [],
        selectionType: props.selectionType ?? OptionSelectionType.Select,
        previousStepOptions: false,
        maxSelections:
          props.selectionType === OptionSelectionType.MultiSelect
            ? 3
            : props.selectionType === OptionSelectionType.Select
              ? 1
              : null,
        linkedResultOptions: [],
      },
    } as FieldSchemaType;
  } else {
    return {
      fieldId: crypto.randomUUID(),
      isInternal: false,
      type: props.type,
      name: "",
      required: true,
    };
  }
};
