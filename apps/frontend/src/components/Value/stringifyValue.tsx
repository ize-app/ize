import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { ValueFragment } from "@/graphql/generated/graphql";
import { userTimezone } from "@/utils/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const stringifyValue = ({ value }: { value: ValueFragment }): string => {
  switch (value.__typename) {
    case "StringValue":
      return value.value;
    case "FloatValue":
      return value.float.toString();
    case "DateTimeValue":
      return `${dayjs.utc(value.dateTime).tz(dayjs.tz.guess()).format("MMMM D YYYY, HH:mm a").toString()} (${userTimezone})`;
    case "DateValue":
      return dayjs(value.date).format("MMMM D YYYY");
    case "UriValue":
      return value.uri;
    case "OptionSelectionsValue":
      return value.selections.map((selection) => selection.optionId).join(", ");
    case "FlowVersionValue":
      return value.flowVersion.flowName;
    case "FlowsValue":
      return value.flows.map((flow) => flow.flowName).join(", ");
    case "EntitiesValue":
      return value.entities.map((entity) => entity.name).join(", ");
    default:
      return "";
  }
};
