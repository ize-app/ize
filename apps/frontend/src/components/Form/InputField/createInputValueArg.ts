import { Entity, FieldDataType, FlowSummaryFragment } from "@/graphql/generated/graphql";

import { InputSchemaType } from "../formValidation/field";

export const createInputValueArg = (input: InputSchemaType): string => {
  switch (input.type) {
    case FieldDataType.String:
      return input.value;
    case FieldDataType.Uri:
      return input.value;
    case FieldDataType.Date:
      return input.value.utc().format("YYYY-MM-DD"); // 2019-03-06
    case FieldDataType.Number:
      return input.value.toString();
    case FieldDataType.DateTime:
      return input.value.utc().format(); // 2019-03-06T00:00:00Z
    case FieldDataType.EntityIds:
      return JSON.stringify((input.value as Entity[]).map((e) => e.entityId));
    case FieldDataType.FlowIds:
      return JSON.stringify((input.value as FlowSummaryFragment[]).map((f) => f.flowId));
    case FieldDataType.FlowVersionId:
      return input.value;
    default:
      throw new Error(`Unknown field data type: ${input.type}`);
  }
};
