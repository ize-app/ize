import { FieldDataType, Result, ResultItem } from "@/graphql/generated/resolver-types";
import { ResultPrismaType } from "../resultPrismaTypes";

export const resultResolver = (result: ResultPrismaType): Result => {
  return {
    __typename: "Result",
    id: result.id,
    createdAt: result.createdAt.toISOString(),
    resultConfigId: result.resultConfigId,
    hasResult: result.hasResult,
    resultItems: result.ResultItems.map(
      (resultItem): ResultItem => ({
        id: resultItem.id,
        value: resultItem.value,
        dataType: resultItem.dataType as FieldDataType,
        optionId: resultItem.fieldOptionId,
      }),
    ),
  };
};
