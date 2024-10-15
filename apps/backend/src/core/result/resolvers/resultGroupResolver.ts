import { FieldDataType, Result, ResultGroup, ResultItem } from "@/graphql/generated/resolver-types";

import { ResultGroupPrismaType } from "../resultPrismaTypes";

export const resultGroupResolver = (result: ResultGroupPrismaType): ResultGroup => {
  return {
    __typename: "ResultGroup",
    id: result.id,
    createdAt: result.createdAt.toISOString(),
    resultConfigId: result.resultConfigId,
    hasResult: result.hasResult,
    results: result.Result.map(
      (result): Result => ({
        name: result.name,
        resultItems: result.ResultItems.map(
          (resultItem): ResultItem => ({
            id: resultItem.id,
            value: resultItem.value,
            dataType: resultItem.dataType as FieldDataType,
            optionId: resultItem.fieldOptionId,
          }),
        ),
      }),
    ),
  };
};
