import { GraphqlRequestContext } from "@/graphql/context";
import { Option } from "@/graphql/generated/resolver-types";

import { FieldOptionSetPrismaType } from "../fieldPrismaTypes";
import { fieldOptionResolver } from "./fieldOptionResolver";

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
    return fieldOptionResolver({ option, context });
  });
};
