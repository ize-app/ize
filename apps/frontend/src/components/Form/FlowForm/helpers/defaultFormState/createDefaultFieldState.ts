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
        maxSelections:
          props.selectionType === OptionSelectionType.Select || !props.selectionType ? 1 : null,
        selectionType: props.selectionType ?? OptionSelectionType.Select,
        previousStepOptions: false,
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
