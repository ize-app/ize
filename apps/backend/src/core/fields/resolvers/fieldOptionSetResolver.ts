import { valueResolver } from "@/core/value/valueResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Option } from "@/graphql/generated/resolver-types";

import { FieldOptionSetPrismaType } from "../fieldPrismaTypes";

export const fieldOptionSetResolver = ({
  fieldOptionSet,
  context,
}: {
  fieldOptionSet: FieldOptionSetPrismaType | null | undefined;
  context: GraphqlRequestContext;
}) => {
  if (!fieldOptionSet) {
    return [];
  }

  return fieldOptionSet.FieldOptions.map((option): Option => {
    return {
      optionId: option.id,
      value: valueResolver({ type: "option", value: option.Value, context }),
    };
  });
};
