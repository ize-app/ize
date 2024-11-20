import {
  FieldOptionSchemaType,
  FieldSchemaType,
  TriggerDefinedOptionsSchemaType,
} from "@/components/Form/FlowForm/formValidation/fields";
import {
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
} from "@/graphql/generated/graphql";

// Define a union type for all possible arguments with a discriminant 'type' field
type FieldArg =
  | {
      type: FieldType.Options;
      question: string;
      options: FieldOptionSchemaType[];
      linkedResultId: string | undefined | null;
      triggerDefinedOptions: TriggerDefinedOptionsSchemaType;
      selectionType: FieldOptionsSelectionType;
      decisionType?: DecisionType;
    }
  | { type: FieldType.FreeInput; question: string };

// A single function that uses discriminated unions
export function generateFieldConfig(arg: FieldArg): FieldSchemaType {
  const base = {
    fieldId: crypto.randomUUID(),
    name: arg.question,
    required: true,
    isInternal: false,
  };

  switch (arg.type) {
    case FieldType.Options:
      return {
        type: FieldType.Options,
        ...base,
        isInternal: arg.decisionType === DecisionType.Ai,
        optionsConfig: {
          previousStepOptions: !!arg.linkedResultId,
          triggerDefinedOptions: arg.triggerDefinedOptions,
          selectionType: arg.selectionType,
          maxSelections: null,

          options: arg.options,
          linkedResultOptions: arg.linkedResultId ? [{ id: arg.linkedResultId }] : [],
        },
      };
    case FieldType.FreeInput:
      return {
        type: FieldType.FreeInput,
        ...base,
        freeInputDataType: FieldDataType.String,
      };

    default:
      throw new Error("Invalid FieldType");
  }
}
