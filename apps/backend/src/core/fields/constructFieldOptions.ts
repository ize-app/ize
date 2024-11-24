import { Option } from "@/graphql/generated/resolver-types";

import { FieldOptionsConfigPrismaType } from "./fieldPrismaTypes";
import { RequestDefinedOptionSetPrismaType } from "../request/requestPrismaTypes";
import { fieldOptionSetResolver } from "./resolvers/fieldOptionSetResolver";

export const constructFieldOptions = ({
  optionsConfig,
  requestDefinedOptionSets,
}: {
  optionsConfig: FieldOptionsConfigPrismaType;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[] | undefined;
}): Option[] => {
  const requestOptions: Option[] = [];

  (requestDefinedOptionSets ?? [])
    .filter((s) => s.fieldId === optionsConfig.fieldId)
    .forEach((s) => {
      const options = fieldOptionSetResolver({
        fieldOptionSet: s.FieldOptionSet,
      });
      requestOptions.push(...options);
    });

  const flowOptions = fieldOptionSetResolver({
    fieldOptionSet: optionsConfig.PredefinedOptionSet,
  });

  return [...flowOptions, ...requestOptions];
};
