import {
  DecisionType,
  FieldFragment,
  FieldType,
  OptionFragment,
  ResultConfigFragment,
  ResultType,
} from "@/graphql/generated/graphql";
import { Box, Chip, Typography } from "@mui/material";
import { FieldOptions } from "./FieldOptions";

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

const defaultDecisionDescription = (defaultOption: OptionFragment) => {
  return `If decision isn't made, default result is "${defaultOption.name}. `;
};

const rankingDescription = (numOptionsToInclude: number | null | undefined) => {
  return numOptionsToInclude
    ? `Only the top ${numOptionsToInclude} options will be included in the final ranking.`
    : "All options will be included in the final result. ";
};

export const ResultConfig = ({
  resultConfig,
  field,
}: {
  resultConfig: ResultConfigFragment;
  field: FieldFragment | null;
}) => {
  switch (resultConfig.__typename) {
    case ResultType.Decision: {
      return (
        <>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Chip label="Decision" size="small" />{" "}
            <Typography variant="label">{field?.name}</Typography>
          </Box>
          <Typography variant="description">
            {decisionTypeDescription(resultConfig.decisionType, resultConfig.threshold)}
            {minAnswersDescription(
              resultConfig.minimumAnswers,
              resultConfig.__typename as ResultType,
            )}
            {resultConfig.defaultOption && defaultDecisionDescription(resultConfig.defaultOption)}
          </Typography>
          {field && field.__typename === FieldType.Options && <FieldOptions fieldOptions={field} />}
        </>
      );
    }
    case ResultType.LlmSummary: {
      return (
        <>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Chip label="LLM Summary" size="small" />{" "}
            <Typography variant="label">{field?.name}</Typography>
          </Box>
          <Typography variant="description">
            All responses will be summarized with AI using the following prompt: "
            {resultConfig.prompt}"
          </Typography>
        </>
      );
    }
    case ResultType.Ranking: {
      return (
        <>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Chip label="Ranking" size="small" />{" "}
            <Typography variant="label">{field?.name}</Typography>
          </Box>
          <Typography variant="description">
            {rankingDescription(resultConfig.numOptionsToInclude)}
          </Typography>
        </>
      );
    }
  }
};
