import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";

interface DefaultOptionFieldStateProps {
  fieldType: FieldType.Options;
  stepIndex: number;
  fieldIndex: number;
  selectionType: FieldOptionsSelectionType;
}

interface DefaultFreeInputFieldStateProps {
  fieldType: FieldType.FreeInput;
  stepIndex: number;
  fieldIndex: number;
}
type DefaultFieldProps = DefaultOptionFieldStateProps | DefaultFreeInputFieldStateProps;

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
          selectionType,
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
