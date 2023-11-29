import {
  DecisionType,
  ProcessDecision,
} from "@/components/shared/Form/ProcessForm/types";
import {
  AbsoluteDecisionArgs,
  DecisionArgs,
  PercentageDecisionArgs,
} from "@/graphql/generated/graphql";

const createDecisionInputs = (
  formDecision: ProcessDecision | undefined,
): DecisionArgs => {
  switch (formDecision?.type) {
    case DecisionType.Absolute:
      return {
        expirationSeconds: formDecision?.requestExpirationSeconds as number,
        absoluteDecision: {
          ...(formDecision.absoluteDecision as AbsoluteDecisionArgs),
        },
      };
    case DecisionType.Percentage:
      return {
        expirationSeconds: formDecision?.requestExpirationSeconds as number,
        percentageDecision: {
          ...(formDecision.percentageDecision as PercentageDecisionArgs),
        },
      };
    default:
      throw Error("Invalid decision types");
  }
};

export default createDecisionInputs;
