import { NewRequestArgs, RequestFieldArgs } from "@/graphql/generated/graphql";
import { NewRequestFormSchema } from "./newRequestWizard";
import { RequestFieldSchemaType } from "./validation";

export const createNewRequestMutationArgs = (formState: NewRequestFormSchema): NewRequestArgs => {
  if (!formState.flow) throw Error("createNewRequestMutationArgs: Missing Flow");
  const flowId: string = formState.flow.id;
  const requestFields: RequestFieldArgs[] = Object.entries(
    (formState.requestFields ?? []) as RequestFieldSchemaType,
  ).map((entry) => ({
    inputId: entry[0],
    value: entry[1].value.toString(),
  }));

  const requestDefinedOptions: string[] = (formState.requestDefinedOptions ?? []).map(
    (option) => option.name,
  );

  return { flowId, requestFields, requestDefinedOptions };
};
