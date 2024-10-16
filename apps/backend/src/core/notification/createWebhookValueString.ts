import { WebhookValue } from "@/graphql/generated/resolver-types";

export const  createWebhookValueString = (values: WebhookValue[]) => {
  return values
    .map((val) => {
      if (val.value) {
        return `<strong>${val.fieldName}</strong>: ${val.value ?? ""}`;
      } else {
        return `<strong>${val.fieldName}</strong>:\n${val.optionSelections?.map((o) => ` - ${o}`).join("\n")}`;
      }
    })
    .join(`\n`);
};
