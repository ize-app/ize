import { WebhookPayload } from "@/core/action/webhook/createWebhookPayload";
import {
  GenericFieldAndValue,
  ResultGroup,
  TestWebhookArgs,
  WebhookValueArgs,
} from "@/graphql/generated/resolver-types";

export const createTestWebhookPayload = (args: TestWebhookArgs): WebhookPayload => {
  return {
    flowName: args.flowName,
    requestName: "Test request",
    requestTriggerAnswers: args.requestFields.map((field) => generateFieldData(field)),
    results: args.results.map((result) => {
      result.
      const resultGroup: ResultGroup = {
        result

      }
    }),
    requestUrl: "https://ize.space",
  };
};

const generateFieldData = (field: WebhookValueArgs): GenericFieldAndValue => {
  field.
  return {
    fieldName: field.fieldName,
    value: ["Test value"],
  };
};
