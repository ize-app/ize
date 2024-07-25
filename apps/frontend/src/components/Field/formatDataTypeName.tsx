import { FieldDataType } from "@/graphql/generated/graphql";

export const formatDataTypeName = (dataType: FieldDataType): string => {
  switch (dataType) {
    case FieldDataType.String:
      return "text";
    case FieldDataType.Number:
      return "number";
    case FieldDataType.Date:
      return "date";
    case FieldDataType.DateTime:
      return "date + time";
    case FieldDataType.Uri:
      return "link";
    case FieldDataType.FlowVersionId:
      return "flow version";
    case FieldDataType.EntityIds:
      return "identities and roles ";
    case FieldDataType.FlowIds:
      return "flows";
  }
};
