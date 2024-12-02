import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { ValueType } from "@/graphql/generated/graphql";
import { userTimezone } from "@/utils/timezone";

import { InputSchemaType } from "./inputValidation";

dayjs.extend(utc);
dayjs.extend(timezone);

/// this needs a lot of work
export const stringifyFormInputValue = ({ input }: { input: InputSchemaType }): string => {
  const { type, value } = input;
  switch (type) {
    case ValueType.String:
      return input.value;
    case ValueType.Float:
      return value.toString();
    case ValueType.Date:
      return dayjs(value).format("MMMM D YYYY");
    case ValueType.DateTime:
      return `${dayjs.utc(value).tz(dayjs.tz.guess()).format("MMMM D YYYY, HH:mm a").toString()} (${userTimezone})`;
    case ValueType.Uri:
      return value;
    // this case statement shouldn't be hit because it's handled upstream
    // TODO: make this not as janky
    case ValueType.Entities:
      return value.map((entity) => entity.name).join(", ");
    case ValueType.Flows:
      return value.map((flow) => flow.flowName).join(", ");
    case ValueType.FlowVersion:
      return value.flowName;
    case ValueType.OptionSelections:
      throw Error("Stringifying option selections not supported");
  }
};
