import { GraphqlRequestContext } from "@/graphql/context";
import { Option } from "@/graphql/generated/resolver-types";

import { FieldOptionsConfigPrismaType } from "./fieldPrismaTypes";
import { RequestDefinedOptionSetPrismaType } from "../request/requestPrismaTypes";
import { fieldOptionSetResolver } from "./resolvers/fieldOptionSetResolver";

export const constructFieldOptions = ({
  optionsConfig,
  requestDefinedOptionSets,
  context,
}: {
  optionsConfig: FieldOptionsConfigPrismaType;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[] | undefined;
  context: GraphqlRequestContext;
}): Option[] => {
  const requestOptions: Option[] = [];

  (requestDefinedOptionSets ?? [])
    .filter((s) => s.fieldId === optionsConfig.fieldId)
    .map((s) => {
      const options = fieldOptionSetResolver({
        fieldOptionSet: s.FieldOptionSet,
        context,
      });
      requestOptions.push(...options);
      return;
    });

  const flowOptions = fieldOptionSetResolver({
    fieldOptionSet: optionsConfig.PredefinedOptionSet,
    context,
  });

  return [...flowOptions, ...requestOptions];
};
