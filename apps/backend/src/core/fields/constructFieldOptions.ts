import { FieldOption } from "@prisma/client";

import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldPrismaType } from "./fieldPrismaTypes";
import { RequestDefinedOptionSetPrismaType } from "../request/requestPrismaTypes";

export const constructFieldOptions = ({
  field,
  requestDefinedOptionSets,
}: {
  field: FieldPrismaType;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[];
}): FieldOption[] => {
  const fieldOptionsConfig = field.FieldOptionsConfig;

  if (!fieldOptionsConfig)
    throw new GraphQLError(`Options field answer is missing options config. fieldId: ${field.id}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  const stepDefinedOptions = fieldOptionsConfig.PredefinedOptionSet?.FieldOptions ?? [];

  const requestDefinedOptionSet = requestDefinedOptionSets.find(
    (rdos) => rdos.fieldId === field.id,
  );

  const requestDefinedOptions = requestDefinedOptionSet?.FieldOptionSet.FieldOptions ?? [];

  const options = [...stepDefinedOptions, ...requestDefinedOptions];

  return options;
};
