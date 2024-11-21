import { DecisionType, ResultType } from "@/graphql/generated/graphql";

import { ResultSchemaType } from "../formValidation/result";

interface ResultLabelConfigProps {
  result: ResultSchemaType | undefined;
}

// note: this mirrors getResultConfigName on the backend
export const getResultFormLabel = ({ result }: ResultLabelConfigProps) => {
  if (!result) return "Collaborative step";
  switch (result.type) {
    case ResultType.Decision: {
      const decisionType = result.decision?.type;
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
      if (result.llmSummary && result.llmSummary.isList) return "Summarize options w/ AI";
      else return "Summarize w/ AI";
    }
    case ResultType.RawAnswers:
      return "Collect raw answers";

    default:
      return "Collaborative step";
  }
};
