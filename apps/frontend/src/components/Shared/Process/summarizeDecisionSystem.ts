import { Process } from "../../../types";

export const summarizeDecisionSystem = (decision: Process.Decision): string => {
  const summaryText =
    decision.thresholdType === Process.ThresholdTypes.Absolute
      ? `First option with ${decision.threshold} responses is selected.`
      : `Once there have been at least ${
          decision.quorum.threshold
        } responses total, the first option to get at least ${
          decision.threshold * 100
        }% of the vote is selected.`;

  return summaryText;
};
