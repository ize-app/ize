import {
  NewRequestArgs,
  FieldAnswerArgs,
  RequestDefinedOptionsArgs,
  FieldOptionArgs,
} from "@/graphql/generated/graphql";
import { NewRequestFormSchema } from "./newRequestWizard";
import { RequestFieldSchemaType } from "./validation";

export const createNewRequestMutationArgs = (formState: NewRequestFormSchema): NewRequestArgs => {
  if (!formState.flow) throw Error("createNewRequestMutationArgs: Missing Flow");
  const flowId: string = formState.flow.id;

  const requestFields: FieldAnswerArgs[] = Object.entries(
    (formState.requestFields ?? []) as RequestFieldSchemaType,
  )
    .map((entry) => ({
      fieldId: entry[0],
      value: entry[1].value ? entry[1].value.toString() : null,
    }))
    .filter((f) => !!f.value);

  const requestDefinedOptions: RequestDefinedOptionsArgs[] =
    formState.requestDefinedOptions && (formState.requestDefinedOptions ?? []).length > 0
      ? [
          {
            options: formState.requestDefinedOptions.map(
              (option): FieldOptionArgs => ({ name: option.name, dataType: option.dataType }),
            ),
            fieldId: formState.flow.steps[0]?.response.fields[0].fieldId as string,
          },
        ]
      : [];

  return { flowId, requestFields, requestDefinedOptions };
};
