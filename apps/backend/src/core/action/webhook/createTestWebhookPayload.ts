import { RequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import {
  GenericFieldAndValue,
  TestWebhookArgs,
  WebhookValueArgs,
} from "@/graphql/generated/resolver-types";

export const createTestWebhookPayload = (args: TestWebhookArgs): RequestPayload => {
  return {
    flowName: args.flowName,
    requestName: "Test request",
    requestTriggerAnswers: args.requestFields.map((field) => generateFieldData(field)),
    results: args.results.map((result) => generateFieldData(result)),
    requestUrl: "https://ize.space",
  };
};

const generateFieldData = (field: WebhookValueArgs): GenericFieldAndValue => {
  return {
    fieldName: field.fieldName,
    value: ["Test value"],
  };
};
