import { WebhookPayload } from "@/core/action/webhook/createWebhookPayload";
import {
  Field,
  OptionSelectionType,
  Result,
  ResultGroup,
  ResultGroupStatus,
  ResultType,
  TestWebhookArgs,
  TriggerFieldAnswer,
  Value,
  ValueType,
} from "@/graphql/generated/resolver-types";

export const createTestWebhookPayload = (args: TestWebhookArgs): WebhookPayload => {
  return {
    flowName: args.flowName,
    requestName: "Test request",
    context: args.triggerFields.map((triggerField) => createTriggerFieldAnswer(triggerField)),
    results: args.results.map((type) => createResultGroup({ type })),
    requestUrl: "https://ize.space",
  };
};

const createTriggerFieldAnswer = ({
  type,
  name,
}: {
  type: ValueType;
  name: string;
}): TriggerFieldAnswer => {
  const field = createField({ type, name });
  const answer = createValue({ type });

  return { field, answer };
};

const createField = ({ type, name }: { type: ValueType; name: string }): Field => {
  let field: Field;

  const fieldId = crypto.randomUUID();
  const isInternal = false;
  const required = true;

  if (type === ValueType.OptionSelections) {
    field = {
      fieldId,
      type,
      name,
      isInternal,
      required,
      optionsConfig: {
        linkedResultOptions: [],
        selectionType: OptionSelectionType.Select,
        options: [
          {
            optionId: crypto.randomUUID(),
            value: { __typename: "StringValue", value: "Example value 1" },
          },
        ],
      },
    };
  } else {
    field = { fieldId, type, name, isInternal, required };
  }

  return field;
};

const createValue = ({ type }: { type: ValueType }): Value => {
  switch (type) {
    case ValueType.String:
      return { __typename: "StringValue", value: "Example value" };
    case ValueType.Float:
      return { __typename: "FloatValue", float: 1 };
    case ValueType.Date:
      return { __typename: "FloatValue", float: 1 };
    case ValueType.Uri:
      return { __typename: "UriValue", uri: "https://example.com", name: "Example link" };
    case ValueType.OptionSelections:
      return {
        __typename: "OptionSelectionsValue",
        selections: [
          {
            optionId: crypto.randomUUID(),
            weight: 1,
            value: { __typename: "StringValue", value: "Example option selection" },
          },
        ],
      };
    case ValueType.Entities:
      return {
        __typename: "EntitiesValue",
        entities: [
          {
            entityId: crypto.randomUUID(),
            __typename: "User",
            id: crypto.randomUUID(),
            name: "Example entity",
            createdAt: new Date().toISOString(),
          },
        ],
      };
    case ValueType.DateTime:
      return { __typename: "DateTimeValue", dateTime: new Date().toISOString() };
    case ValueType.FlowVersion:
      return {
        __typename: "FlowVersionValue",
        flowVersion: {
          flowVersionId: crypto.randomUUID(),
          flowId: crypto.randomUUID(),
          flowName: "Example flow",
        },
      };
    case ValueType.Flows:
      return {
        __typename: "FlowsValue",
        flows: [
          {
            flowVersionId: crypto.randomUUID(),
            flowId: crypto.randomUUID(),
            flowName: "Example flow",
          },
        ],
      };
  }
};

const createResultGroup = ({ type }: { type: ResultType }): ResultGroup => {
  const resultGroup: ResultGroup = {
    id: crypto.randomUUID(), // maybe send
    complete: true,
    createdAt: new Date().toISOString(),
    resultConfigId: crypto.randomUUID(),
    status: ResultGroupStatus.FinalResult,
    results: [],
  };

  let result: Result;

  switch (type) {
    case ResultType.Decision: {
      result = {
        id: crypto.randomUUID(),
        name: "Decision",
        type,
        resultItems: [{ id: crypto.randomUUID(), value: createValue({ type: ValueType.String }) }],
      };
      break;
    }
    case ResultType.Ranking: {
      result = {
        id: crypto.randomUUID(),
        name: "Ranking",
        type,
        resultItems: [
          { id: crypto.randomUUID(), value: createValue({ type: ValueType.String }) },
          { id: crypto.randomUUID(), value: createValue({ type: ValueType.String }) },
        ],
      };
      break;
    }
    case ResultType.LlmSummary: {
      result = {
        id: crypto.randomUUID(),
        name: "LLM summary",
        type,
        resultItems: [{ id: crypto.randomUUID(), value: createValue({ type: ValueType.String }) }],
      };
      break;
    }
    case ResultType.RawAnswers: {
      result = {
        id: crypto.randomUUID(),
        name: "Raw answers",
        type,
        resultItems: [
          { id: crypto.randomUUID(), value: createValue({ type: ValueType.String }) },
          { id: crypto.randomUUID(), value: createValue({ type: ValueType.String }) },
        ],
      };
      break;
    }
  }

  resultGroup.results.push(result);
  return resultGroup;
};
