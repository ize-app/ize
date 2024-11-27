import dayjs from "dayjs";

import { FieldDataType } from "@/graphql/generated/graphql";

// take raw data from the server and convert it to the form state
// used currently for evolving the flow form
export const createInputValueFormState = (value: string, dataType: FieldDataType) => {
  switch (dataType) {
    case FieldDataType.DateTime:
      return dayjs.utc(value);
    case FieldDataType.Date:
      return dayjs(value);
    // Note: this doesn't yet support flowVersionIds, entityIds, or flowIds but those fields aren't part of the flow form yet
    default:
      return value;
  }
};
