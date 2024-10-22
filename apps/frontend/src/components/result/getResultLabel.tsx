import { DecisionType, ResultConfig, ResultType } from "@/graphql/generated/graphql";

import { ResultSchemaType } from "../Form/FlowForm/formValidation/result";

interface ResultLabelConfigProps {
  type: "setup";
  result: ResultSchemaType;
}

interface ResultLabelFlowProps {
  type: "resultConfig";
  result: ResultConfig;
}

export type ResultLabelProps = ResultLabelConfigProps | ResultLabelFlowProps;

export const getResultLabel = ({ type, result }: ResultLabelProps) => {
  let resultType: ResultType;
  let decisionType: DecisionType | null;
  if (type === "resultConfig") {
    resultType = result.__typename as ResultType;
    decisionType = result.__typename === ResultType.Decision ? result.decisionType : null;
  } else {
    resultType = result.type;
    decisionType = result.type === ResultType.Decision ? result.decision.type : null;
  }

  switch (resultType) {
    case ResultType.Decision: {
      switch (decisionType) {
        case DecisionType.Ai:
          return "AI decides";
        case DecisionType.NumberThreshold:
          return "Vote to approve";
        case DecisionType.PercentageThreshold:
          return "Majority vote";
        case DecisionType.WeightedAverage:
          return "Prioritize options";
        default:
          return "Let AI decide";
      }
    }
    case ResultType.Ranking:
      return "Prioritize into ranked list";
    case ResultType.LlmSummary:
      return "Summarize w/ AI";
    case ResultType.LlmSummaryList:
      return "Summarize options w/ AI";
    default:
      return "Result";
  }
};
