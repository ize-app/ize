import {
  FieldSchemaType,
  TriggerDefinedOptionsSchemaType,
} from "@/components/Form/FlowForm/formValidation/fields";
import { OptionSchemaType } from "@/components/Form/InputField/inputValidation";
import { DecisionType, OptionSelectionType, ValueType } from "@/graphql/generated/graphql";

// Define a union type for all possible arguments with a discriminant 'type' field
type FieldArg =
  | {
      type: ValueType.OptionSelections;
      question: string;
      options: OptionSchemaType[];
      linkedResultId: string | undefined | null;
      triggerDefinedOptions: TriggerDefinedOptionsSchemaType;
      selectionType: OptionSelectionType;
      decisionType?: DecisionType;
    }
  | { type: ValueType.String; question: string };

// A single function that uses discriminated unions
export function generateFieldConfig(arg: FieldArg): FieldSchemaType {
  const base = {
    fieldId: crypto.randomUUID(),
    name: arg.question,
    required: true,
    isInternal: false,
  };

  switch (arg.type) {
    case ValueType.OptionSelections:
      return {
        type: ValueType.OptionSelections,
        ...base,
        isInternal: arg.decisionType === DecisionType.Ai,
        optionsConfig: {
          triggerDefinedOptions: arg.triggerDefinedOptions,
          selectionType: arg.selectionType,
          maxSelections: null,
          options: arg.options,
          linkedResultOptions: arg.linkedResultId ? [{ id: arg.linkedResultId }] : [],
        },
      };
    case ValueType.String:
      return {
        type: ValueType.String,
        ...base,
      };

    default:
      throw new Error("Invalid FieldType");
  }
}
