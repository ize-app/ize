import { createFieldAnswersArgs } from "@/components/Form/InputField/createMutationArgs/createFieldAnswerArgs";
import { createOptionsArgs } from "@/components/Form/InputField/createMutationArgs/createOptionsArgs";
import {
  FieldAnswerArgs,
  NewRequestArgs,
  RequestDefinedOptionsArgs,
} from "@/graphql/generated/graphql";

import { NewRequestFormSchema } from "./newRequestWizard";

export const createNewRequestMutationArgs = (formState: NewRequestFormSchema): NewRequestArgs => {
  if (!formState.flow) throw Error("createNewRequestMutationArgs: Missing Flow");
  const flowId: string = formState.flow.flowId;

  const request = formState.request;
  if (!request) throw Error("createNewRequestMutationArgs: Missing Request");

  const name: string = request.name;

  const requestFields: FieldAnswerArgs[] = createFieldAnswersArgs(request.requestFields);

  const requestDefinedOptions: RequestDefinedOptionsArgs[] = Object.entries(
    request.requestDefinedOptions,
  ).map(([fieldId, options]) => {
    return {
      fieldId,
      options: createOptionsArgs(options),
    };
  });

  return { requestId: request.requestId, flowId, requestFields, requestDefinedOptions, name };
};
