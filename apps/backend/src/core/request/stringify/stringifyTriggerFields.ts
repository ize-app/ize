import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

import { stringifyGenericFieldValues } from "./stringifyGenericFieldValues";

export const stringifyTriggerFields = ({
  triggerFields,
  type,
}: {
  triggerFields: GenericFieldAndValue[];
  type: "html" | "markdown";
}): string => {
  return stringifyGenericFieldValues({
    values: triggerFields,
    type,
  });
};
