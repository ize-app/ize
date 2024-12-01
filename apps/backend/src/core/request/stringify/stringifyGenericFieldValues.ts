import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

import { stringifyValue } from "./stringifyInput";

export const stringifyGenericFieldValues = ({
  values,
  type,
}: {
  values: GenericFieldAndValue[];
  type: "html" | "markdown";
}): string => {
  const boldOpen = type === "html" ? "<strong>" : "**";
  const boldClose = type === "html" ? "</strong>" : "**";

  return values
    .map((val) => {
      const value = val.value;

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return `${boldOpen}${val.fieldName}${boldClose}: -`;
        } else if (value.length === 1) {
          return `${boldOpen}${val.fieldName}${boldClose}:\n${stringifyValue(value[0])}`;
        } else {
          return `${boldOpen}${val.fieldName}${boldClose}:\n${value.map((v) => `- ${stringifyValue(v)}`).join(`\n`)}`;
        }
      } else {
        return `${boldOpen}${val.fieldName}${boldClose}: ${stringifyValue(value)}`;
      }
    })
    .join(`\n`);
};
