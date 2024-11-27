import { createFreeInputDefaultValue } from "@/components/Form/InputField/createFormState/createFreeInputDefaultState";
import { InputSchemaType, OptionSchemaType } from "@/components/Form/InputField/inputValidation";
import { FieldDataType } from "@/graphql/generated/graphql";

export const createDefaultOptionState = ({
  dataType,
}: {
  dataType: FieldDataType;
}): OptionSchemaType => ({
  optionId: crypto.randomUUID(),
  input: {
    value: createFreeInputDefaultValue({ dataType }),
    type: dataType,
    required: true,
  } as InputSchemaType,
});
