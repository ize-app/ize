import { valueResolver } from "@/core/value/valueResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Option } from "@/graphql/generated/resolver-types";

import { FieldOptionPrismaType } from "../fieldPrismaTypes";

export const fieldOptionResolver = ({
  option,
  context,
}: {
  option: FieldOptionPrismaType;
  context: GraphqlRequestContext;
}): Option => ({
  optionId: option.id,
  value: valueResolver({ type: "option", value: option.Value, context }),
});
