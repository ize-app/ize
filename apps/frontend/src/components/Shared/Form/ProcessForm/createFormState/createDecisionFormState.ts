import { DecisionTypes } from "@/graphql/generated/graphql";

import {
  DecisionType,
  ProcessDecision,
} from "@/components/shared/Form/ProcessForm/types";

const createDecisionFormState = (
  decisionSystem: DecisionTypes,
  requestExpirationSeconds: number,
): ProcessDecision => {
  let decForm: ProcessDecision;
  switch (decisionSystem.__typename) {
    case "AbsoluteDecision":
      decForm = {
        type: DecisionType.Absolute,
        requestExpirationSeconds: requestExpirationSeconds,
        absoluteDecision: {
          threshold: decisionSystem.threshold,
        },
      };
      break;
    case "PercentageDecision":
      decForm = {
        type: DecisionType.Percentage,
        requestExpirationSeconds: requestExpirationSeconds,
        percentageDecision: {
          quorum: decisionSystem.quorum,
          percentage: decisionSystem.percentage,
        },
      };
      break;
    default:
      throw Error("Invalid decision type");
  }
  return decForm;
};

export default createDecisionFormState;
