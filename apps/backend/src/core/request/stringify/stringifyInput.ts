import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { Value } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

dayjs.extend(utc);
dayjs.extend(timezone);

export const stringifyValue = (value: Value): string => {
  switch (value.__typename) {
    case "DateValue":
      return value.date;
    case "DateTimeValue":
      return `${dayjs.utc(value.dateTime).tz("America/Los_Angeles").format("MMMM D YYYY, HH:mm a").toString()} (PT)`;
    case "FloatValue":
      return value.float.toString();
    case "FlowVersionValue":
      return value.flowVersion.flowName;
    case "StringValue":
      return value.value;
    case "UriValue":
      return value.uri;
    case "FlowsValue":
      return value.flows.map((flow) => flow.flowName).join(", ");
    case "EntitiesValue":
      return value.entities.map((entity) => entity.name).join(", ");
    case "OptionSelectionsValue":
      return value.selections.map((option) => stringifyValue(option.value)).join(", ");
    default:
      throw new GraphQLError(`Unknown value type: ${value.__typename}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};
