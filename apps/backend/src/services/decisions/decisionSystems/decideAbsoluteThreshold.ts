import { AbsoluteDecision } from "@graphql/generated/resolver-types";
import { ResponseCount } from "../determineDecision";

const decideAbsoluteThreshold = (
  system: AbsoluteDecision,
  responseCount: ResponseCount,
): string | null => {
  for (let i = 0; i <= responseCount.length - 1; i++) {
    const option = responseCount[i];
    if (option._count.optionId >= system.threshold) {
      return option.optionId;
    }
  }
  return null;
};

export default decideAbsoluteThreshold;
