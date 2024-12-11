import { Value } from "@/graphql/generated/resolver-types";

import { WebhookValue } from "./createWebhookPayload";

export const createWebhookValue = ({ value }: { value: Value }): WebhookValue => {
  switch (value.__typename) {
    case "StringValue":
      return value.value;
    case "FloatValue":
      return value.float;
    case "DateTimeValue":
      return value.dateTime;
    case "DateValue":
      return value.date;
    case "UriValue":
      return { uri: value.uri, name: value.name };
    case "OptionSelectionsValue":
      return value.selections.map((selection) => createWebhookValue({ value: selection.value }));
    case "FlowVersionValue":
      return value.flowVersion;
    case "FlowsValue":
      return value.flows;
    case "EntitiesValue":
      return value.entities;
    default:
      return "";
  }
};
