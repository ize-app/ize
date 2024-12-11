import {
  TestWebhookArgs,
  TestWebhookResultArgs,
  TestWebhookTriggerFieldsArgs,
  ValueType,
} from "@/graphql/generated/graphql";

import { FlowSchemaType } from "../formValidation/flow";

export const createTestWebhookArgs = (formState: FlowSchemaType, uri: string): TestWebhookArgs => {
  return {
    uri,
    flowName: formState.name ?? "flowName",
    triggerFields: (formState.fieldSet.fields ?? []).map(
      (field): TestWebhookTriggerFieldsArgs => ({
        name: field.name,
        valueType: field.type,
      }),
    ),
    results: createResultsArgs(formState),
  };
};

const createResultsArgs = (formState: FlowSchemaType): TestWebhookResultArgs[] => {
  const results: TestWebhookResultArgs[] = [];

  formState.steps.forEach((step) => {
    (step.result ?? []).forEach((result) => {
      // resultTypes.push(result.type);
      const field = step.fieldSet.fields.find((field) => field.fieldId === result.fieldId);
      let valueType: ValueType;
      if (field?.type === ValueType.OptionSelections) {
        valueType = field.optionsConfig.options[0]?.input?.type ?? ValueType.String;
      } else {
        valueType = field?.type ?? ValueType.String;
      }

      results.push({ name: field?.name ?? "field", type: result.type, valueType });
    });
  });
  return results;
};
