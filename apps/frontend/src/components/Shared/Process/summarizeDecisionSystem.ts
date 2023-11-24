import { DecisionTypesSummaryPartsFragment } from "../../../graphql/generated/graphql";
import {
  DecisionType,
  ProcessDecision,
} from "@/components/shared/Form/ProcessForm/types";

export const summarizeDecisionSystem = (
  decision: DecisionTypesSummaryPartsFragment,
): string => {
  const summaryText =
    decision.__typename === "AbsoluteDecision"
      ? `First option with ${decision.threshold} responses is selected.`
      : `Once there have been at least ${decision.quorum} responses total, the first option to get at least ${decision.percentage}% of the vote is selected.`;

  return summaryText;
};

// version of this function built when data is from FE form rather than backend
export const summarizeDecisionSystemForm = (
  decision: ProcessDecision,
): string => {
  const summaryText =
    decision.type === DecisionType.Absolute
      ? `First option with ${
          decision.absoluteDecision?.threshold as number
        } responses is selected.`
      : `Once there have been at least ${
          decision.percentageDecision?.quorum as number
        } responses total, the first option to get at least ${
          decision.percentageDecision?.percentage as number
        }% of the vote is selected.`;

  return summaryText;
};
