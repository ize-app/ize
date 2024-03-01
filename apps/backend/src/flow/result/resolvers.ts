import {
  AutoApprove,
  Decision,
  DecisionType,
  LlmSummary,
  LlmSummaryType,
  Option,
  Ranking,
  Raw,
  ResultConfig,
  ResultType,
} from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { ResultConfigPrismaType } from "./types";

export const resultConfigResolver = (
  resultConfig: ResultConfigPrismaType,
  responseOptions: Option[] | undefined,
): ResultConfig => {
  switch (resultConfig.resultType) {
    case ResultType.Decision:
      return resultConfigDecisionResolver(resultConfig, responseOptions);
    case ResultType.Ranking:
      return resultConfigRankResolver(resultConfig);
    case ResultType.LlmSummary:
      return resultConfigLlmResolver(resultConfig);
    case ResultType.Raw:
      return resultConfigRawResolver(resultConfig);
    case ResultType.AutoApprove:
      const auto: AutoApprove = { __typename: "AutoApprove" };
      return auto;
    default:
      throw new GraphQLError("Invalid result type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};

const resultConfigDecisionResolver = (
  resultConfig: ResultConfigPrismaType,
  responseOptions: Option[] | undefined,
): Decision => {
  const decConfig = resultConfig.ResultConfigDecision;
  if (!decConfig)
    throw new GraphQLError("Missing decision config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  let defaultOption: Option | undefined = undefined;

  if (decConfig.defaultOptionId) {
    defaultOption = (responseOptions ?? []).find(
      (option) => option.optionId === decConfig.defaultOptionId,
    );
    if (!defaultOption)
      throw new GraphQLError("Cannot find default option for decision", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }

  return {
    __typename: "Decision",
    minimumAnswers: resultConfig.minAnswers,
    decisionType: decConfig.type as DecisionType,
    threshold: decConfig.threshold,
  };
};

const resultConfigRankResolver = (resultConfig: ResultConfigPrismaType): Ranking => {
  const rankConfig = resultConfig.ResultConfigRank;
  if (!rankConfig)
    throw new GraphQLError("Missing rank config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  return {
    __typename: "Ranking",
    minimumAnswers: resultConfig.minAnswers,
    numOptionsToInclude: rankConfig.numOptionsToInclude,
  };
};

const resultConfigLlmResolver = (resultConfig: ResultConfigPrismaType): LlmSummary => {
  const llmConfig = resultConfig.ResultConfigLlm;
  if (!llmConfig)
    throw new GraphQLError("Missing llm config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  return {
    __typename: "LlmSummary",
    minimumAnswers: resultConfig.minAnswers,
    summaryType: llmConfig.type as LlmSummaryType,
    prompt: llmConfig.prompt,
  };
};

const resultConfigRawResolver = (resultConfig: ResultConfigPrismaType): Raw => {
  return {
    __typename: "Raw",
    minimumAnswers: resultConfig.minAnswers,
  };
};
