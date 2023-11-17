import { InputTemplate, InputTemplateArgs } from "@/graphql/generated/graphql";

const createInputsFormState = (
  inputTemplates: InputTemplate[],
): InputTemplateArgs[] => {
  return inputTemplates.map((input) => ({
    name: input.name,
    required: input.required,
    type: input.type,
    description: input.description,
  }));
};

export default createInputsFormState;
