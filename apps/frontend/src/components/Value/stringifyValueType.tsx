import { ValueType } from "@/graphql/generated/graphql";

export const stringifyValueType = (type: ValueType): string => {
  switch (type) {
    case ValueType.String:
      return "text";
    case ValueType.Float:
      return "number";
    case ValueType.Date:
      return "date";
    case ValueType.DateTime:
      return "date + time";
    case ValueType.Uri:
      return "URL";
    case ValueType.FlowVersion:
      return "flow version";
    case ValueType.Entities:
      return "identities and roles ";
    case ValueType.Flows:
      return "flows";
    case ValueType.OptionSelections:
      return "option selections";
  }
};
