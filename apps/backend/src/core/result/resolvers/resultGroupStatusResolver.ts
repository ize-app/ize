import { ResultGroupStatus } from "@/graphql/generated/resolver-types";

import { ResultGroupPrismaType, ResultPrismaType } from "../resultPrismaTypes";

export const resultGroupStatusResolver = ({
  resultGroup,
  responseFinal,
  resultsFinal,
  results,
}: {
  resultGroup: ResultGroupPrismaType;
  responseFinal: boolean;
  resultsFinal: boolean;
  results: ResultPrismaType[];
}): ResultGroupStatus => {
  if (!responseFinal) {
    const hasResults = results.some((result) => result.ResultItems.length > 0);
    if (hasResults) return ResultGroupStatus.Preliminary;
    else return ResultGroupStatus.NotStarted;
  } else {
    if (resultsFinal) {
      if (resultGroup.complete) {
        if (resultGroup.Result.length > 0) return ResultGroupStatus.FinalResult;
        else return ResultGroupStatus.FinalNoResult;
      } else return ResultGroupStatus.Error;
    } else return ResultGroupStatus.Attempting;
  }
};
