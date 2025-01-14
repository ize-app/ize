import { GraphqlRequestContext } from "@/graphql/context";
import { Field, ResultConfig } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { resultConfigResolver } from "./resultConfigResolver";
import { ResultConfigSetPrismaType } from "../resultPrismaTypes";

export const resultsConfigSetResolver = (
  resultConfigSet: ResultConfigSetPrismaType | null | undefined,
  responseFields: Field[],
  context: GraphqlRequestContext,
): ResultConfig[] => {
  if (!resultConfigSet) return [];

  return resultConfigSet.ResultConfigs.map((r): ResultConfig => {
    let responseField: Field | undefined | null = null;
    responseField = (responseFields ?? []).find((f) => f.fieldId === r.fieldId);

    if (!responseField)
      throw new GraphQLError(`No field found for resultConfig ${r.id}.`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    return resultConfigResolver({ resultConfig: r, field: responseField, context });
  });
};
