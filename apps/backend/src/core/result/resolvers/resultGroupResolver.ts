import { valueResolver } from "@/core/value/valueResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Result, ResultGroup, ResultItem, ResultType } from "@/graphql/generated/resolver-types";

import { resultGroupStatusResolver } from "./resultGroupStatusResolver";
import { ResultGroupPrismaType } from "../resultPrismaTypes";

export const resultGroupResolver = ({
  resultGroup,
  responseFinal,
  resultsFinal,
  context,
}: {
  resultGroup: ResultGroupPrismaType;
  responseFinal: boolean;
  resultsFinal: boolean;
  context: GraphqlRequestContext;
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
        id: result.id,
        name: result.name,
        type: result.type as ResultType,
        resultItems: result.ResultItems.map((resultItem): ResultItem => {
          return {
            id: resultItem.id,
            value: valueResolver({ type: "default", value: resultItem.Value, context }),
            optionId: resultItem.fieldOptionId,
          };
        }),
      }),
    ),
  };
};
