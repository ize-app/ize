import { FieldDataType, FieldType, OptionSelectionType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";

interface DefaultFieldProps {
  fieldType: FieldType;
  selectionType?: OptionSelectionType;
}

export const createDefaultFieldState = (props: DefaultFieldProps): FieldSchemaType => {
  switch (props.fieldType) {
    case FieldType.Options: {
      const { selectionType } = props;
      return {
        fieldId: crypto.randomUUID(),
        type: FieldType.Options,
        name: "",
        isInternal: false,
        required: true,
        optionsConfig: {
          options: [],
          selectionType: selectionType ?? OptionSelectionType.Select,
          previousStepOptions: false,
          maxSelections:
            selectionType === OptionSelectionType.MultiSelect
              ? 3
              : selectionType === OptionSelectionType.Select
                ? 1
                : null,
          linkedResultOptions: [],
        },
      } as FieldSchemaType;
    }
    case FieldType.FreeInput: {
      return {
        fieldId: crypto.randomUUID(),
        isInternal: false,
        type: FieldType.FreeInput,
        name: "",
        required: true,
        freeInputDataType: FieldDataType.String,
      } as FieldSchemaType;
    }
  }
};
