import {
  Decision,
  DecisionType,
  Field,
  LlmSummary,
  Option,
  Ranking,
  ResultConfig,
  ResultType,
} from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { ResultConfigPrismaType } from "../types";

export const resultConfigResolver = (
  resultConfig: ResultConfigPrismaType,
  responseField: Field | undefined | null,
): ResultConfig => {
  switch (resultConfig.resultType) {
    case ResultType.Decision:
      return resultConfigDecisionResolver(resultConfig, responseField);
    case ResultType.Ranking:
      return resultConfigRankResolver(resultConfig);
    case ResultType.LlmSummary:
      return resultConfigLlmResolver(resultConfig);
    default:
      throw new GraphQLError("Invalid result type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};

const resultConfigDecisionResolver = (
  resultConfig: ResultConfigPrismaType,
  responseField: Field | undefined | null,
): Decision => {
  let defaultOption: Option | undefined = undefined;

  const decConfig = resultConfig.ResultConfigDecision;
  if (!decConfig)
    throw new GraphQLError("Missing decision config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (decConfig.defaultOptionId) {
    if (responseField?.__typename !== "Options")
      throw new GraphQLError("Default option specififed but field is not an Options type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    defaultOption = responseField.options.find(
      (option) => option.optionId === decConfig.defaultOptionId,
    );
    if (!defaultOption)
      throw new GraphQLError("Cannot find default option for decision", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }

  return {
    __typename: "Decision",
    resultConfigId: resultConfig.id,
    fieldId: resultConfig.fieldId,
    minimumAnswers: resultConfig.minAnswers,
    decisionType: decConfig.type as DecisionType,
    threshold: decConfig.threshold,
    defaultOption,
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
    fieldId: resultConfig.fieldId,
    resultConfigId: resultConfig.id,
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
    resultConfigId: resultConfig.id,
    minimumAnswers: resultConfig.minAnswers,
    fieldId: resultConfig.fieldId,
    prompt: llmConfig.prompt,
  };
};
