import {
  DecisionType,
  Field,
  OptionSelectionType,
  ResultType,
} from "@/graphql/generated/resolver-types";

import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const getResultConfigName = ({
  resultConfig,
  field,
}: {
  resultConfig: ResultConfigPrismaType;
  field: Field | undefined;
}): string => {
  const resultType = resultConfig.resultType;

  switch (resultType) {
    case ResultType.Decision: {
      const decisionType = resultConfig.ResultConfigDecision?.type;
      switch (decisionType) {
        case DecisionType.Ai:
          return "Decide: AI decides";
        case DecisionType.NumberThreshold:
          return "Decide: Approval vote";
        case DecisionType.PercentageThreshold:
          return "Decide: Majority vote";
        case DecisionType.WeightedAverage: {
          const selectionType = field?.optionsConfig?.selectionType;
          switch (selectionType) {
            case OptionSelectionType.Rank:
              return "Decide: Ranked vote";
            case OptionSelectionType.Select:
              return "Decide: Most selected option";
            default:
              return "Decide: Weighted average";
          }
        }
        default:
          return "Decision";
      }
    }
    case ResultType.Ranking:
      return "Prioritize";
    case ResultType.LlmSummary: {
      if (resultConfig.ResultConfigLlm?.isList) return "Collect ideas (AI refined)";
      else return "Create consensus w/ AI";
    }
    case ResultType.RawAnswers:
      return "Get ideas";
    default:
      return "Collaborative step";
  }
};
