import { FieldDataType, Result, ResultGroup, ResultItem } from "@/graphql/generated/resolver-types";

import { resultGroupStatusResolver } from "./resultGroupStatusResolver";
import { ResultGroupPrismaType } from "../resultPrismaTypes";

export const resultGroupResolver = ({
  resultGroup,
  responseFinal,
  resultsFinal,
}: {
  resultGroup: ResultGroupPrismaType;
  responseFinal: boolean;
  resultsFinal: boolean;
}): ResultGroup => {
  return {
    __typename: "ResultGroup",
    id: resultGroup.id,
    createdAt: resultGroup.createdAt.toISOString(),
    resultConfigId: resultGroup.resultConfigId,
    complete: resultGroup.complete,
    status: resultGroupStatusResolver({
      resultGroup,
      responseFinal,
      resultsFinal,
      results: resultGroup.Result,
    }),
    results: resultGroup.Result.map(
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
