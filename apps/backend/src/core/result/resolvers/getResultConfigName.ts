import { DecisionType, ResultType } from "@/graphql/generated/resolver-types";

import { ResultConfigPrismaType } from "../resultPrismaTypes";

export const getResultConfigName = ({
  resultConfig,
}: {
  resultConfig: ResultConfigPrismaType;
}): string => {
  const resultType = resultConfig.resultType;

  switch (resultType) {
    case ResultType.Decision: {
      const decisionType = resultConfig.ResultConfigDecision?.type;
      switch (decisionType) {
        case DecisionType.Ai:
          return "Let AI decide";
        case DecisionType.NumberThreshold:
          return "Vote to approve";
        case DecisionType.PercentageThreshold:
          return "Majority vote";
        case DecisionType.WeightedAverage:
          return "Prioritize options";
        default:
          return "Decision";
      }
    }
    case ResultType.Ranking:
      return "Prioritize into ranked list";
    case ResultType.LlmSummary: {
      if (resultConfig.ResultConfigLlm?.isList) return "Summarize options w/ AI";
      else return "Summarize w/ AI";
    }
    default:
      return "Collaborative step";
  }
};
