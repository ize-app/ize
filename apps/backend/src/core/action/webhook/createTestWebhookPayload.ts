import {
  FieldType,
  TestWebhookArgs,
  WebhookPayload,
  WebhookValue,
  WebhookValueArgs,
} from "@/graphql/generated/resolver-types";

export const createTestWebhookPayload = (args: TestWebhookArgs): WebhookPayload => {
  return {
    createdAt: new Date().toISOString(),
    flowName: args.flowName,
    requestName: "Test request",
    requestFields: args.requestFields.map((field) => generateFieldData(field)),
    results: args.results.map((result) => generateFieldData(result)),
    requestUrl: "https://ize.space",
  };
};

const generateFieldData = (field: WebhookValueArgs): WebhookValue => {
  if (field.fieldType === FieldType.FreeInput) {
    return {
      fieldName: field.fieldName,
      value: "Test value",
    };
  } else {
    return {
      fieldName: field.fieldName,
      optionSelections: ["Option 1", "Option 2"],
    };
  }
};
