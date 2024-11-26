import { createFieldAnswersArgs } from "@/components/Form/InputField/createFieldAnswerArgs";
import {
  FieldAnswerArgs,
  FieldOptionArgs,
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
      options: options.map(
        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        (option): FieldOptionArgs => ({
          optionId: crypto.randomUUID(),
          name: option.name as string,
          dataType: option.dataType,
        }),
      ),
    };
  });

  console.log("requestDefinedOptions", requestDefinedOptions);

  return { requestId: request.requestId, flowId, requestFields, requestDefinedOptions, name };
};
