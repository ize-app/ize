import {
  WebhookPayload,
  WebhookResult,
  WebhookTriggerField,
  WebhookValue,
} from "@/core/action/webhook/createWebhookPayload";
import {
  ResultType,
  TestWebhookArgs,
  TestWebhookResultArgs,
  TestWebhookTriggerFieldsArgs,
  ValueType,
} from "@/graphql/generated/resolver-types";

export const createTestWebhookPayload = (args: TestWebhookArgs): WebhookPayload => {
  return {
    flowName: args.flowName,
    requestName: "Test request",
    context: args.triggerFields.map((triggerField) => createTriggerFieldAnswer(triggerField)),
    results: args.results.map((resultArgs) => createResultGroup(resultArgs)),
    requestUrl: "https://ize.space",
  };
};

const createTriggerFieldAnswer = (
  triggerFieldArgs: TestWebhookTriggerFieldsArgs,
): WebhookTriggerField => {
  const name = triggerFieldArgs.name;
  const type = triggerFieldArgs.valueType;
  const value = createValue({ type });

  return { field: name, value };
};

const createValue = ({ type }: { type: ValueType }): WebhookValue => {
  switch (type) {
    case ValueType.String:
      return "Example value";
    case ValueType.Float:
      return 1;
    case ValueType.Date:
      return "2025-01-01";
    case ValueType.Uri:
      return { uri: "https://example.com", name: "Example link" };
    case ValueType.OptionSelections:
      return ["Example selection", "Another selection"];
    case ValueType.Entities:
      return [
        {
          entityId: crypto.randomUUID(),
          __typename: "User",
          id: crypto.randomUUID(),
          name: "Example entity",
          createdAt: new Date().toISOString(),
        },
      ];
    case ValueType.DateTime:
      return new Date().toISOString();
    case ValueType.FlowVersion:
      return {
        flowVersionId: crypto.randomUUID(),
        flowId: crypto.randomUUID(),
        flowName: "Example flow",
      };
    case ValueType.Flows:
      return [
        {
          flowVersionId: crypto.randomUUID(),
          flowId: crypto.randomUUID(),
          flowName: "Example flow",
        },
      ];
  }
};

const createResultGroup = (resultArgs: TestWebhookResultArgs): WebhookResult => {
  const createdAt = new Date().toISOString();
  const field = resultArgs.name;
  const type = resultArgs.type;
  const valueType = resultArgs.valueType;
  const value = [createValue({ type: valueType })];

  if ([ResultType.Ranking,ResultType.RawAnswers].includes(type)) {
    value.push(createValue({ type: valueType }));
    value.push(createValue({ type: valueType }));
  }

  return { createdAt, field, type, value };
};
