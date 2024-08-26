import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";

interface DefaultFieldProps {
  fieldType: FieldType;
  stepIndex: number;
  fieldIndex: number;
  selectionType?: FieldOptionsSelectionType;
}

export const createDefaultFieldState = (props: DefaultFieldProps): FieldSchemaType => {
  switch (props.fieldType) {
    case FieldType.Options: {
      const { stepIndex, fieldIndex, selectionType } = props;
      return {
        fieldId: "new." + stepIndex + "." + fieldIndex,
        type: FieldType.Options,
        name: "",
        required: true,
        optionsConfig: {
          options: [],
          hasRequestOptions: false,
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
      };
    }
    case FieldType.FreeInput: {
      const { stepIndex, fieldIndex } = props;
      return {
        fieldId: "new." + stepIndex + "." + fieldIndex,
        type: FieldType.FreeInput,
        name: "",
        required: true,
        freeInputDataType: FieldDataType.String,
      };
    }
  }
};
