import { Entity, ValueType } from "@/graphql/generated/graphql";

import { InputSchemaType } from "../inputValidation";

export const createInputValueArg = (input: InputSchemaType): string => {
  switch (input.type) {
    case ValueType.String:
      return JSON.stringify(input.value);
    case ValueType.Uri:
      return JSON.stringify(input.value);
    case ValueType.Date:
      // return JSON.stringify(input.value.utc().format("YYYY-MM-DDT00:00:00.000Z")); // 2019-03-06
      return JSON.stringify(input.value.utc().startOf('day').toISOString())
    case ValueType.Float:
      return JSON.stringify(input.value);
    case ValueType.DateTime:
      return JSON.stringify(input.value.utc().toISOString()); // 2019-03-06T00:00:00Z
    case ValueType.Entities:
      return JSON.stringify((input.value as Entity[]).map((e) => e.entityId));
    case ValueType.Flows:
      return JSON.stringify(input.value.map((f) => f.flowId));
    case ValueType.FlowVersion:
      return JSON.stringify(input.value.flowVersionId);
    default:
      throw new Error(`Unknown field data type: ${input.type}`);
  }
};
