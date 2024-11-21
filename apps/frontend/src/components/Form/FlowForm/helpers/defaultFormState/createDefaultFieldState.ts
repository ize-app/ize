import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";

interface DefaultFieldProps {
  fieldType: FieldType;
  selectionType?: FieldOptionsSelectionType;
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
          selectionType: selectionType ?? FieldOptionsSelectionType.Select,
          previousStepOptions: false,
          maxSelections:
            selectionType === FieldOptionsSelectionType.MultiSelect
              ? 3
              : selectionType === FieldOptionsSelectionType.Select
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
