import { createFieldAnswersArgs } from "@/components/Form/utils/createFieldAnswers";
import {
  FieldAnswerArgs,
  FieldOptionArgs,
  NewRequestArgs,
  RequestDefinedOptionsArgs,
} from "@/graphql/generated/graphql";

import { NewRequestFormSchema } from "./newRequestWizard";

export const createNewRequestMutationArgs = async (
  formState: NewRequestFormSchema,
): Promise<NewRequestArgs> => {
  if (!formState.flow || !formState.name) throw Error("createNewRequestMutationArgs: Missing Flow");
  const flowId: string = formState.flow.flowId;
  const name: string = formState.name;

  const requestFields: FieldAnswerArgs[] = await createFieldAnswersArgs(formState.requestFields);

  const requestDefinedOptions: RequestDefinedOptionsArgs[] =
    formState.requestDefinedOptions && (formState.requestDefinedOptions ?? []).length > 0
      ? [
          {
            options: formState.requestDefinedOptions.map(
              //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              (option): FieldOptionArgs => ({ name: option.name, dataType: option.dataType }),
            ),
            // TODO this is incorrect, we need to get the fieldId from the formState
            fieldId: formState.flow.steps[0]?.fieldSet.fields[0].fieldId,
          },
        ]
      : [];

  return { flowId, requestFields, requestDefinedOptions, name };
};
