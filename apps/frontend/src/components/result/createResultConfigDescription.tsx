import { Box, Typography } from "@mui/material";

import { DecisionType, ResultConfigFragment, ResultType } from "@/graphql/generated/graphql";

const decisionTypeDescription = (
  decisionType: DecisionType,
  threshold: number | null | undefined,
  criteria: string | null | undefined,
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
    case DecisionType.Ai: {
      return `AI automatically makes the decision ${criteria ? "based on the following criteria " + criteria : ""}`;
    }
  }
};

const minAnswersDescription = (minAnswers: number, resultType: ResultType) => {
  if (minAnswers === 0) return "";
  return `There must be at least ${minAnswers} ${
    resultType === ResultType.Decision ? "vote" : "answer"
  }${minAnswers > 1 ? "s" : ""} to ${
    resultType === ResultType.Decision ? "make a decision" : "create a result"
  }. `;
};

const PromptBox = ({ prompt }: { prompt: string }) => {
  return (
    <Typography
      variant="description"
      sx={{
        border: "1px solid",
        padding: "12px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        whiteSpace: "pre-line",
        borderRadius: "4px",
        fontStyle: "italic",
      }}
    >
      {prompt}
    </Typography>
  );
};

export const createResultConfigDescription = (
  resultConfig: ResultConfigFragment,
): React.ReactElement => {
  switch (resultConfig.__typename) {
    case ResultType.Decision: {
      return (
        <Typography variant="description" sx={{ whiteSpace: "pre-line" }}>
          {decisionTypeDescription(
            resultConfig.decisionType,
            resultConfig.threshold,
            resultConfig.criteria,
          )}
          {minAnswersDescription(resultConfig.minimumAnswers, ResultType.Decision)}
          {resultConfig.defaultOption
            ? `If decision isn't made, default result is "${resultConfig.defaultOption.name}. `
            : ""}
        </Typography>
      );
    }
    case ResultType.Ranking: {
      return (
        <Typography variant="description">
          {resultConfig.numOptionsToInclude
            ? `Only the top ${resultConfig.numOptionsToInclude} 
          options will be included in the final ranking.`
            : "All options will be included in the final result. "}
        </Typography>
      );
    }
    case ResultType.LlmSummary: {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {resultConfig.prompt && (
            <>
              <Typography variant="description">
                All responses will be summarized with AI using the following prompt:
              </Typography>{" "}
              <PromptBox prompt={resultConfig.prompt} />
            </>
          )}
          {resultConfig.example ? (
            <>
              <Typography variant="description">Example output: </Typography>
              <PromptBox prompt={resultConfig.example} />
            </>
          ) : (
            ""
          )}
          <Typography variant="description">
            {" "}
            {minAnswersDescription(resultConfig.minimumAnswers, ResultType.LlmSummary)}
          </Typography>
        </Box>
      );
    }
    case ResultType.LlmSummaryList: {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {resultConfig.prompt && (
            <>
              <Typography variant="description">
                All responses will be summarized with AI using the following prompt:
              </Typography>{" "}
              <PromptBox prompt={resultConfig.prompt} />
            </>
          )}
          {resultConfig.example ? (
            <>
              <Typography variant="description">Example output: </Typography>
              <PromptBox prompt={resultConfig.example} />
            </>
          ) : (
            ""
          )}
          <Typography variant="description">
            {" "}
            {minAnswersDescription(resultConfig.minimumAnswers, ResultType.LlmSummary)}
          </Typography>
        </Box>
      );
    }
    default: {
      throw Error("Unknown result type");
    }
  }
};
