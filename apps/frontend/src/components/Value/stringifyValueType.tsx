import { ValueType } from "@/graphql/generated/graphql";

export const stringifyValueType = (type: ValueType): string => {
  switch (type) {
    case ValueType.String:
      return "Text";
    case ValueType.Float:
      return "Number";
    case ValueType.Date:
      return "Date";
    case ValueType.DateTime:
      return "Date + time";
    case ValueType.Uri:
      return "Url";
    case ValueType.FlowVersion:
      return "Flow version";
    case ValueType.Entities:
      return "Identities and roles";
    case ValueType.Flows:
      return "Flows";
    case ValueType.OptionSelections:
      return "Option selections";
  }
};
