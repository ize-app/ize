import { Field, ResultConfig } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { resultConfigResolver } from "./resultConfigResolver";
import { ResultConfigSetPrismaType } from "../resultPrismaTypes";


export const resultsConfigSetResolver = (
  resultConfigSet: ResultConfigSetPrismaType | null | undefined,
  responseFields: Field[],
): ResultConfig[] => {
  if (!resultConfigSet) return [];

  return resultConfigSet.ResultConfigSetResultConfigs.map((r): ResultConfig => {
    let responseField: Field | undefined | null = null;
    if (r.ResultConfig.fieldId) {
      responseField = responseFields.find((f) => f.fieldId === r.ResultConfig.fieldId);
      if (!responseField)
        throw new GraphQLError("Field associated with result is not part of this flow version.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
    }
    return resultConfigResolver(r.ResultConfig, responseField);
  });
};
