import { DecisionTypes } from "../../../graphql/generated/graphql";
import {
  ProcessDecision,
  ThresholdTypes,
} from "../../NewProcess/newProcessWizard";

export const formatDecisionToFormState = (
  decisionSystem: DecisionTypes,
): ProcessDecision => {
  if (decisionSystem.__typename === "AbsoluteDecision")
    decisionSystem.threshold;
  return {
    decisionThresholdType:
      decisionSystem.__typename === "AbsoluteDecision"
        ? ThresholdTypes.Absolute
        : ThresholdTypes.Percentage,
    decisionThreshold:
      decisionSystem.__typename === "AbsoluteDecision"
        ? decisionSystem.threshold
        : decisionSystem.__typename === "PercentageDecision"
        ? decisionSystem.percentage
        : undefined,
    quorum:
      decisionSystem.__typename === "PercentageDecision"
        ? {
            quorumType: ThresholdTypes.Absolute,
            quorumThreshold: decisionSystem.quorum,
          }
        : undefined,
  };
};
