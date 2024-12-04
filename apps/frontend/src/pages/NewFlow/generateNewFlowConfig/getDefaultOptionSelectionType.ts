import { DecisionType, OptionSelectionType } from "@/graphql/generated/graphql";

export const getDefaultOptionSelectionType = (decisionType: DecisionType): OptionSelectionType => {
  switch (decisionType) {
    case DecisionType.WeightedAverage:
      return OptionSelectionType.Rank;
    case DecisionType.Ai:
      return OptionSelectionType.None;
    default:
      return OptionSelectionType.Select;
  }
};
