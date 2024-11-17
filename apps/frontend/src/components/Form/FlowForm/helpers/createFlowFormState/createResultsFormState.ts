import {
  DecisionFragment,
  DecisionType,
  ResultConfigFragment,
  ResultType,
} from "@/graphql/generated/graphql";

import {
  DecisionResultSchemaType,
  DecisionSchemaType,
  LlmSummaryListResultSchemaType,
  LlmSummaryResultSchemaType,
  RankingResultSchemaType,
  ResultSchemaType,
} from "../../formValidation/result";

export const createResultFormState = (results: ResultConfigFragment[]): ResultSchemaType[] => {
  return results.map((result) => {
    const resultBase = {
      resultId: result.resultConfigId,
      fieldId: result.field.fieldId,
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
      case ResultType.LlmSummaryList:
        return {
          type: ResultType.LlmSummaryList,
          ...resultBase,
          llmSummary: {
            prompt: result.prompt ?? undefined,
          },
        } as LlmSummaryListResultSchemaType;
      default:
        throw Error(`Unknown result type`);
    }
  });
};

const createDecisionFormState = (decision: DecisionFragment): DecisionSchemaType => {
  const defaultOptionId = decision.defaultOption?.optionId ?? null;
  const defaultDecision = {
    hasDefault: !!defaultOptionId,
    optionId: defaultOptionId,
  };
  const threshold = decision.threshold;
  switch (decision.decisionType) {
    case DecisionType.NumberThreshold:
      if (!threshold) throw Error("createDecisionFormState: Missing decision threshold");
      return {
        type: DecisionType.NumberThreshold,
        threshold,
        defaultDecision,
      };
    case DecisionType.PercentageThreshold:
      if (!threshold) throw Error("createDecisionFormState: Missing decision threshold");
      return {
        type: DecisionType.PercentageThreshold,
        threshold,
        defaultDecision,
      };
    case DecisionType.WeightedAverage:
      return {
        type: DecisionType.WeightedAverage,
        defaultDecision,
      };
    case DecisionType.Ai:
      return {
        type: DecisionType.Ai,
        criteria: decision.criteria ?? "",
        defaultDecision,
      };
  }
};
