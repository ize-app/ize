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
  if (!formState.flow) throw Error("createNewRequestMutationArgs: Missing Flow");
  const flowId: string = formState.flow.flowId;

  const request = formState.request;
  if (!request) throw Error("createNewRequestMutationArgs: Missing Request");

  const name: string = request.name;

  const requestFields: FieldAnswerArgs[] = await createFieldAnswersArgs(request.requestFields);

  const requestDefinedOptions: RequestDefinedOptionsArgs[] = Object.entries(
    request.requestDefinedOptions,
  ).map(([fieldId, options]) => {
    return {
      fieldId,
      options: options.map(
        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        (option): FieldOptionArgs => ({ name: option.name, dataType: option.dataType }),
      ),
    };
  });

  console.log("requestDefinedOptions", requestDefinedOptions);

  return { flowId, requestFields, requestDefinedOptions, name };
};
