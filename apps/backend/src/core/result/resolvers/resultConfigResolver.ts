import {
  Decision,
  DecisionType,
  Field,
  LlmSummary,
  Option,
  Ranking,
  RawAnswers,
  ResultConfig,
  ResultType,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { getResultConfigName } from "./getResultConfigName";
import { ResultConfigPrismaType } from "../resultPrismaTypes";

interface ResultConfigResolver {
  resultConfig: ResultConfigPrismaType;
  field: Field;
}

export const resultConfigResolver = ({
  resultConfig,
  field,
}: ResultConfigResolver): ResultConfig => {
  switch (resultConfig.resultType) {
    case ResultType.Decision:
      return resultConfigDecisionResolver({ resultConfig, field });
    case ResultType.Ranking:
      return resultConfigRankResolver({ resultConfig, field });
    case ResultType.LlmSummary:
      return resultConfigLlmResolver({ resultConfig, field });
    case ResultType.RawAnswers: {
      return resultRawAnswersResolver({ resultConfig, field });
    }
    default:
      throw new GraphQLError("Invalid result type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};

const resultConfigDecisionResolver = ({ resultConfig, field }: ResultConfigResolver): Decision => {
  let defaultOption: Option | undefined = undefined;

  const decConfig = resultConfig.ResultConfigDecision;
  if (!decConfig)
    throw new GraphQLError("Missing decision config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (decConfig.defaultOptionId) {
    if (field?.__typename !== "Options")
      throw new GraphQLError("Default option specififed but field is not an Options type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    defaultOption = field.options.find((option) => option.optionId === decConfig.defaultOptionId);
    if (!defaultOption)
      throw new GraphQLError("Cannot find default option for decision", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }

  return {
    __typename: ResultType.Decision,
    name: getResultConfigName({ resultConfig }),
    resultConfigId: resultConfig.id,
    field,
    criteria: decConfig.criteria,
    decisionType: decConfig.type as DecisionType,
    threshold: decConfig.threshold,
    defaultOption,
  };
};

const resultConfigRankResolver = ({ resultConfig, field }: ResultConfigResolver): Ranking => {
  const rankConfig = resultConfig.ResultConfigRank;
  if (!rankConfig)
    throw new GraphQLError("Missing rank config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  return {
    __typename: ResultType.Ranking,
    name: getResultConfigName({ resultConfig }),
    field,
    resultConfigId: resultConfig.id,
    numOptionsToInclude: rankConfig.numOptionsToInclude,
  };
};

const resultConfigLlmResolver = ({ resultConfig, field }: ResultConfigResolver): LlmSummary => {
  const llmConfig = resultConfig.ResultConfigLlm;
  if (!llmConfig)
    throw new GraphQLError("Missing llm config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  return {
    __typename: ResultType.LlmSummary,
    name: getResultConfigName({ resultConfig }),
    resultConfigId: resultConfig.id,
    field,
    prompt: llmConfig.prompt,
    isList: llmConfig.isList,
  };
};
const resultRawAnswersResolver = ({ resultConfig, field }: ResultConfigResolver): RawAnswers => {
  return {
    __typename: ResultType.RawAnswers,
    name: getResultConfigName({ resultConfig }),
    resultConfigId: resultConfig.id,
    field,
  };
};
