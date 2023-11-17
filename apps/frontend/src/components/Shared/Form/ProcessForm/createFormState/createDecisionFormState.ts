import { DecisionTypes } from "@/graphql/generated/graphql";
import {
  DecisionType,
  ProcessDecision,
} from "@/components/NewProcess/newProcessWizard";

const createDecisionFormState = (
  decisionSystem: DecisionTypes,
): ProcessDecision => {
  let decForm: ProcessDecision;
  switch (decisionSystem.__typename) {
    case "AbsoluteDecision":
      decForm = {
        type: DecisionType.Absolute,
        absoluteDecision: {
          threshold: decisionSystem.threshold,
        },
      };
      break;
    case "PercentageDecision":
      decForm = {
        type: DecisionType.Percentage,
        percentageDecision: {
          quorum: decisionSystem.quorum,
          percentage: decisionSystem.percentage,
        },
      };
      break;
    default:
      decForm = {};
  }
  return decForm;
};

export default createDecisionFormState;
