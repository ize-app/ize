import { ResultGroupStatus } from "@/graphql/generated/resolver-types";

import { ResultGroupPrismaType } from "../resultPrismaTypes";

export const resultGroupStatusResolver = ({
  resultGroup,
  responseFinal,
  resultsFinal,
}: {
  resultGroup: ResultGroupPrismaType;
  responseFinal: boolean;
  resultsFinal: boolean;
}): ResultGroupStatus => {
  if (!responseFinal) return ResultGroupStatus.NotStarted;
  if (resultsFinal) {
    if (resultGroup.complete) {
      if (resultGroup.Result.length > 0) return ResultGroupStatus.FinalResult;
      else return ResultGroupStatus.FinalNoResult;
    } else return ResultGroupStatus.Error;
  } else return ResultGroupStatus.Attempting;
};
