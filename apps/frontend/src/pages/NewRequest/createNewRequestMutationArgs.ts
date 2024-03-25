import {
  NewRequestArgs,
  FieldAnswerArgs,
  RequestDefinedOptionsArgs,
  FieldOptionArgs,
} from "@/graphql/generated/graphql";
import { NewRequestFormSchema } from "./newRequestWizard";
import { createFieldAnswersArgs } from "@/components/Form/utils/createFieldAnswers";

export const createNewRequestMutationArgs = (formState: NewRequestFormSchema): NewRequestArgs => {
  if (!formState.flow || !formState.name) throw Error("createNewRequestMutationArgs: Missing Flow");
  const flowId: string = formState.flow.flowId;
  const name: string = formState.name;

  const requestFields: FieldAnswerArgs[] = createFieldAnswersArgs(formState.requestFields);

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

  return { flowId, requestFields, requestDefinedOptions, name };
};
