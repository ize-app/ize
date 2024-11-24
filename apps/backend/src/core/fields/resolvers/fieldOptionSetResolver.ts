import { FieldDataType, Option } from "@/graphql/generated/resolver-types";

import { FieldOptionSetPrismaType } from "../fieldPrismaTypes";

export const fieldOptionSetResolver = ({
  fieldOptionSet,
}: {
  fieldOptionSet: FieldOptionSetPrismaType | null | undefined;
}) => {
  return (fieldOptionSet?.FieldOptions ?? []).map(
    (option): Option => ({
      optionId: option.id,
      name: option.name,
      dataType: option.dataType as FieldDataType,
    }),
  );
};
