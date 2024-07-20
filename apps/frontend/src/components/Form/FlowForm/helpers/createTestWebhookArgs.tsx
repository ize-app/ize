import { FieldType, TestWebhookArgs, WebhookValueArgs } from "@/graphql/generated/graphql";

import { FlowSchemaType } from "../formValidation/flow";

export const createTestWebhookArgs = (formState: FlowSchemaType, uri: string): TestWebhookArgs => {
  return {
    uri,
    flowName: formState.name ?? "flowName",
    requestFields: (formState.steps[0].request?.fields ?? []).map((field) => ({
      fieldName: field.name ?? "Field name",
      fieldType: field.type ?? FieldType.FreeInput,
    })),
    results: createResultsArgs(formState),
  };
};

const createResultsArgs = (formState: FlowSchemaType): WebhookValueArgs[] => {
  const results: WebhookValueArgs[] = [];

  formState.steps.forEach((step) => {
    const fields = step.response?.fields ?? [];
    (step.result ?? []).forEach((result) => {
      const field = fields.find((f) => f.fieldId === result.fieldId);
      results.push({
        fieldName: field?.name ?? "Field name",
        fieldType: field?.type ?? FieldType.FreeInput,
      });
    });
  });

  return results;
};
