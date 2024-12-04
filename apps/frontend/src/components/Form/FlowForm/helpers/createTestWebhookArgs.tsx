import {
  ResultType,
  TestWebhookArgs,
  TestWebhookTriggerFieldsArgs,
} from "@/graphql/generated/graphql";

import { FlowSchemaType } from "../formValidation/flow";

export const createTestWebhookArgs = (formState: FlowSchemaType, uri: string): TestWebhookArgs => {
  return {
    uri,
    flowName: formState.name ?? "flowName",
    triggerFields: (formState.fieldSet.fields ?? []).map(
      (field): TestWebhookTriggerFieldsArgs => ({
        name: field.name,
        type: field.type,
      }),
    ),
    results: createResultsArgs(formState),
  };
};

const createResultsArgs = (formState: FlowSchemaType): ResultType[] => {
  const resultTypes: ResultType[] = [];

  formState.steps.forEach((step) => {
    (step.result ?? []).forEach((result) => {
      resultTypes.push(result.type);
    });
  });
  return resultTypes;
};
