import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { FieldDataType } from "@/graphql/generated/graphql";

dayjs.extend(utc);
dayjs.extend(timezone);

/// this needs a lot of work
export const stringifyFreeInputValue = ({
  value,
  dataType: type,
}: {
  value: string;
  dataType: FieldDataType;
}): string => {
  switch (type) {
    case FieldDataType.String:
      return value;
    case FieldDataType.Number:
      return value.toString();
    case FieldDataType.Date:
      return dayjs.utc(value).tz(dayjs.tz.guess()).format("MMMM D YYYY");
    case FieldDataType.DateTime:
      return `${dayjs.utc(value).tz(dayjs.tz.guess()).format("MMMM D YYYY, HH:mm a").toString()} (${dayjs().tz(dayjs.tz.guess()).format("z")})`;
    case FieldDataType.Uri:
      return value;
    // this case statement shouldn't be hit because it's handled upstream
    // TODO: make this not as janky
    case FieldDataType.EntityIds:
      return "";
    case FieldDataType.FlowIds:
      return "";
    case FieldDataType.FlowVersionId:
      return "";
  }
};
