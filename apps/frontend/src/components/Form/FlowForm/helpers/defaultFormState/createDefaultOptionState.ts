import { createInputValueFormState } from "@/components/Form/InputField/createFormState/createInputFormState";
import { OptionSchemaType } from "@/components/Form/InputField/inputValidation";
import { ValueType } from "@/graphql/generated/graphql";

export const createDefaultOptionState = ({ type }: { type: ValueType }): OptionSchemaType => ({
  optionId: crypto.randomUUID(),
  input: createInputValueFormState({ type: "newOption", valueType: type }),
});
