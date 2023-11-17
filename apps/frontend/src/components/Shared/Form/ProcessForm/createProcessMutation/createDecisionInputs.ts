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
        absoluteDecision: {
          ...(formDecision.absoluteDecision as AbsoluteDecisionArgs),
        },
      };
    case DecisionType.Percentage:
      return {
        percentageDecision: {
          ...(formDecision.percentageDecision as PercentageDecisionArgs),
        },
      };
    default:
      throw Error("Invalid decision types");
  }
};

export default createDecisionInputs;
