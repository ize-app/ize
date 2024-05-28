import {
  DecisionFragment,
  DecisionType,
  ResultConfig,
  ResultType,
} from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "../../formValidation/fields";
import {
  DecisionResultSchemaType,
  DecisionSchemaType,
  LlmSummaryResultSchemaType,
  RankingResultSchemaType,
  ResultSchemaType,
} from "../../formValidation/result";

export const createResultFormState = (results: ResultConfig[]): ResultSchemaType[] => {
  return results.map((result) => {
    const resultBase = {
      resultId: result.resultConfigId,
      fieldId: result.fieldId ?? null,
      minimumAnswers: result.minimumAnswers,
    };
    switch (result.__typename) {
      case ResultType.Decision:
        return {
          type: ResultType.Decision,
          ...resultBase,
          decision: createDecisionFormState(result),
        } as DecisionResultSchemaType;
      case ResultType.Ranking:
        return {
          type: ResultType.Ranking,
          ...resultBase,
          prioritization: {
            numPrioritizedItems: result.numOptionsToInclude ?? null,
          },
        } as RankingResultSchemaType;
      case ResultType.LlmSummary:
        return {
          type: ResultType.LlmSummary,
          ...resultBase,
          llmSummary: {
            prompt: result.prompt ?? undefined,
          },
        } as LlmSummaryResultSchemaType;
      default:
        throw Error("Unknown result type");
    }
  });
};

const createDecisionFormState = (decision: DecisionFragment): DecisionSchemaType => {
  const defaultOptionId = decision.defaultOption?.optionId ?? DefaultOptionSelection.None;
  const type = decision.decisionType;
  const threshold = decision.threshold;
  switch (decision.decisionType) {
    case DecisionType.NumberThreshold:
      if (!threshold) throw Error("createDecisionFormState: Missing decision threshold");
      return {
        type,
        threshold,
        defaultOptionId,
      };
    case DecisionType.PercentageThreshold:
      if (!threshold) throw Error("createDecisionFormState: Missing decision threshold");
      return {
        type,
        threshold,
        defaultOptionId,
      };
    case DecisionType.WeightedAverage:
      return {
        type: DecisionType.WeightedAverage,
        defaultOptionId,
      };
  }
};
