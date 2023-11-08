import { DecisionTypesSummaryPartsFragment } from "../../../graphql/generated/graphql";
import {
  ProcessDecision,
  ThresholdTypes,
} from "../../NewProcess/newProcessWizard";

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

// version of this function built when data is from FE form rather than backend
export const summarizeDecisionSystemForm = (
  decision: ProcessDecision,
): string => {
  const summaryText =
    decision.decisionThresholdType === ThresholdTypes.Absolute
      ? `First option with ${
          decision.decisionThreshold as number
        } responses is selected.`
      : `Once there have been at least ${
          decision.quorum?.quorumThreshold as number
        } responses total, the first option to get at least ${
          (decision.decisionThreshold as number) * 100
        }% of the vote is selected.`;

  return summaryText;
};
