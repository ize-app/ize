import { PercentageDecision } from "@graphql/generated/resolver-types";
import { ResponseCount } from "../determineDecision";

const decidePercentageThreshold = (
  system: PercentageDecision,
  responseCount: ResponseCount,
): string | null => {
  const totalResponses = responseCount.length;
  if (totalResponses < system.quorum) return null;
  const decisionThreshold = Math.ceil(system.percentage * totalResponses);

  for (let i = 0; i <= responseCount.length - 1; i++) {
    const option = responseCount[i];
    if (
      option._count.optionId >= system.quorum &&
      option._count.optionId >= decisionThreshold
    ) {
      return option.optionId;
    }
  }
  return null;
};

export default decidePercentageThreshold;
