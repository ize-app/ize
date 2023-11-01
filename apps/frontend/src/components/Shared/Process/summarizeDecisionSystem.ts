import { DecisionTypesSummaryPartsFragment } from "../../../graphql/generated/graphql";

export const summarizeDecisionSystem = (
  decision: DecisionTypesSummaryPartsFragment,
): string => {
  const summaryText =
    decision.__typename === "AbsoluteDecision"
      ? `First option with ${decision.threshold} responses is selected.`
      : `Once there have been at least ${
          decision.quorum
        } responses total, the first option to get at least ${
          decision.percentage * 100
        }% of the vote is selected.`;

  return summaryText;
};
