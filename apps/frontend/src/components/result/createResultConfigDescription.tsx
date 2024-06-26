import { DecisionType, ResultConfigFragment, ResultType } from "@/graphql/generated/graphql";

const decisionTypeDescription = (
  decisionType: DecisionType,
  threshold: number | null | undefined,
) => {
  switch (decisionType) {
    case DecisionType.NumberThreshold: {
      return `Decision is made for the first option to reach ${threshold} vote${
        threshold && threshold > 1 ? "s" : ""
      }. `;
    }
    case DecisionType.PercentageThreshold: {
      return `Decision is made for the first option to reach ${threshold}% of votes. `;
    }
    case DecisionType.WeightedAverage: {
      return `Decision is made based on the weighted average of all rankings. `;
    }
  }
};

const minAnswersDescription = (minAnswers: number, resultType: ResultType) => {
  return `There must be at least ${minAnswers} ${
    resultType === ResultType.Decision ? "vote" : "answer"
  }${minAnswers > 1 ? "s" : ""} to ${
    resultType === ResultType.Decision ? "make a decision" : "create a result"
  }. `;
};

export const createResultConfigDescription = (resultConfig: ResultConfigFragment) => {
  switch (resultConfig.__typename) {
    case ResultType.Decision: {
      return `${decisionTypeDescription(
        resultConfig.decisionType,
        resultConfig.threshold,
      )}${minAnswersDescription(resultConfig.minimumAnswers, ResultType.Decision)}${
        resultConfig.defaultOption
          ? `If decision isn't made, default result is "${resultConfig.defaultOption.name}. `
          : ""
      }`;
    }
    case ResultType.Ranking: {
      return resultConfig.numOptionsToInclude
        ? `Only the top ${resultConfig.numOptionsToInclude} options will be included in the final ranking.`
        : "All options will be included in the final result. ";
    }
    case ResultType.LlmSummary: {
      return `All responses will be summarized with AI using the following prompt: 
      
      "${resultConfig.prompt}"${
        resultConfig.example
          ? `
      
      Example output: 

      "${resultConfig.example}"`
          : ""
      }

      ${minAnswersDescription(resultConfig.minimumAnswers, ResultType.LlmSummary)}
      `;
    }
    case ResultType.LlmSummaryList: {
      return `All responses will be summarized with AI using the following prompt: 
      
      "${resultConfig.prompt}"

      ${minAnswersDescription(resultConfig.minimumAnswers, ResultType.LlmSummary)}
      `;
    }
  }
};
