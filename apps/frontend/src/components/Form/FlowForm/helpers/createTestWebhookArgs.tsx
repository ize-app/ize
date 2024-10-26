import {
  FieldType,
  ResultGroupTestWebhookArgs,
  TestWebhookArgs,
} from "@/graphql/generated/graphql";

import { FlowSchemaType } from "../formValidation/flow";

export const createTestWebhookArgs = (formState: FlowSchemaType, uri: string): TestWebhookArgs => {
  return {
    uri,
    flowName: formState.name ?? "flowName",
    requestFields: (formState.fieldSet.fields ?? []).map((field) => ({
      fieldName: field.name ?? "Field name",
      fieldType: field.type ?? FieldType.FreeInput,
    })),
    results: createResultsArgs(formState),
  };
};

const createResultsArgs = (formState: FlowSchemaType): ResultGroupTestWebhookArgs[] => {
  const resultGroups: ResultGroupTestWebhookArgs[] = [];

  formState.steps.forEach((step) => {
    const fields = step.fieldSet?.fields ?? [];
    (step.result ?? []).forEach((result) => {
      const field = fields.find((f) => f.fieldId === result.fieldId);
      const resultGroup: ResultGroupTestWebhookArgs = {
        fieldName: field?.name ?? "Field name",
        results: [
          {
            fieldName: field?.name ?? "Field name",
            fieldType: field?.type ?? FieldType.FreeInput,
          },
        ],
      };
      resultGroups.push(resultGroup);
    });
  });

  return resultGroups;
};
