import dayjs from "dayjs";

import { FieldAnswer, FieldDataType } from "@/graphql/generated/graphql";

export const createFreeInputDefaultValue = ({
  defaultValue,
  dataType,
}: {
  defaultValue?: FieldAnswer | undefined | null;
  dataType: FieldDataType;
}) => {
  if (defaultValue)
    switch (defaultValue.__typename) {
      case "EntitiesFieldAnswer":
        return defaultValue.entities;
      case "FlowsFieldAnswer":
        return defaultValue.flows;
      case "FreeInputFieldAnswer":
        return defaultValue.value;
      case "WebhookFieldAnswer":
        return defaultValue;
      case "OptionFieldAnswer":
        return defaultValue.selections;
      default:
        return "";
    }
  else
    switch (dataType) {
      case FieldDataType.Date:
        return dayjs();
      case FieldDataType.DateTime:
        return dayjs();
      case FieldDataType.EntityIds:
        return [];
      case FieldDataType.FlowIds:
        return [];
      case FieldDataType.Number:
        return "";
      case FieldDataType.String:
        return "";
      default:
        return "";
    }
};
