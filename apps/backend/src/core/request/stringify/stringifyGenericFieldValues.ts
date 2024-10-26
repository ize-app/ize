import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

export const stringifyGenericFieldValues = ({
  values,
  type,
}: {
  values: GenericFieldAndValue[];
  type: "html" | "markdown";
}) => {
  const boldOpen = type === "html" ? "<strong>" : "**";
  const boldClose = type === "html" ? "</strong>" : "**";
  return values
    .map((val) => {
      if (val.value.length === 0) {
        return `${boldOpen}${val.fieldName}${boldClose}: -`;
      } else if (val.value.length === 1) {
        return `${boldOpen}${val.fieldName}${boldClose}:\n${val.value[0]}`;
      } else {
        return `${boldOpen}${val.fieldName}${boldClose}:\n- ${val.value.map((v) => `- ${v}`).join(`\n`)}`;
      }
    })
    .join(`\n`);
};
