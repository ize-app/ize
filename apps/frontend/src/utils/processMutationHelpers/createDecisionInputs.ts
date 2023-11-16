import {
  DecisionType,
  ProcessDecision,
} from "../../components/NewProcess/newProcessWizard";
import { DecisionArgs } from "../../graphql/generated/graphql";

const createDecisionInputs = (
  formDecision: ProcessDecision | undefined,
): DecisionArgs => {
  const decision: DecisionArgs = {
    absoluteDecision:
      formDecision?.type === DecisionType.Absolute
        ? {
            ...formDecision.absoluteDecision,
          }
        : null,
    percentageDecision:
      formDecision?.type === DecisionType.Percentage
        ? {
            ...formDecision.percentageDecision,
          }
        : null,
  };

  return decision;
};

export default createDecisionInputs;
