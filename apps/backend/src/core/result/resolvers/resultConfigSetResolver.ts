import { ResultConfig, Field } from "@/graphql/generated/resolver-types";
import { ResultConfigSetPrismaType } from "../resultPrismaTypes";
import { resultConfigResolver } from "./resultConfigResolver";

import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const resultsConfigSetResolver = (
  resultConfigSet: ResultConfigSetPrismaType | null | undefined,
  responseFields: Field[],
): ResultConfig[] => {
  if (!resultConfigSet) return [];

  return resultConfigSet.ResultConfigSetResultConfigs.map((r): ResultConfig => {
    let responseField: Field | undefined | null = null;
    if (r.ResultConfig.fieldId) {
      const responseField = responseFields.find((f) => f.fieldId === r.ResultConfig.fieldId);
      if (!responseField)
        throw new GraphQLError("Field associated with result is not part of this flow version.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
    }
    return resultConfigResolver(r.ResultConfig, responseField);
  });
};
