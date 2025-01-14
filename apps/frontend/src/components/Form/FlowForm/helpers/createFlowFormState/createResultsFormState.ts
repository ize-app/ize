import { UUIDRemapper } from "@/components/Form/utils/UUIDRemapper";
import {
  DecisionFragment,
  DecisionType,
  ResultConfigFragment,
  ResultType,
} from "@/graphql/generated/graphql";

import {
  DecisionConditionsSchemaType,
  DecisionSchemaType,
  RankingResultSchemaType,
  ResultSchemaType,
} from "../../formValidation/result";

export const createResultFormState = (
  results: ResultConfigFragment[],
  uuidRemapper: UUIDRemapper,
): ResultSchemaType[] => {
  return results.map((result): ResultSchemaType => {
    const resultBase = {
      resultConfigId: uuidRemapper.remapId(result.resultConfigId),
      fieldId: uuidRemapper.getRemappedUUID(result.field.fieldId),
    };

    // TODO typechecking isn't working here for some reason
    switch (result.__typename) {
      case ResultType.Decision:
        return {
          type: ResultType.Decision,
          ...resultBase,
          decision: createDecisionFormState(result, uuidRemapper),
        };
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
            prompt: result.prompt ?? "",
            isList: result.isList,
          },
        };
      case ResultType.RawAnswers:
        return {
          type: ResultType.RawAnswers,
          ...resultBase,
        };
      default:
        throw Error(`Unknown result type`);
    }
  });
};

const createDecisionFormState = (
  decision: DecisionFragment,
  uuidRemapper: UUIDRemapper,
): DecisionSchemaType => {
  const defaultOptionId = decision.defaultOption?.optionId
    ? uuidRemapper.getRemappedUUID(decision.defaultOption?.optionId)
    : null;

  const defaultDecision = {
    hasDefault: !!defaultOptionId,
    optionId: defaultOptionId,
  };

  const conditions: DecisionConditionsSchemaType = decision.conditions.map((condition) => ({
    optionId: uuidRemapper.getRemappedUUID(condition.option.optionId),
    threshold: condition.threshold,
  }));

  const threshold = decision.threshold;
  switch (decision.decisionType) {
    case DecisionType.NumberThreshold:
      if (!threshold) throw Error("createDecisionFormState: Missing decision threshold");
      return {
        type: DecisionType.NumberThreshold,
        threshold,
        defaultDecision,
        conditions,
      };
    case DecisionType.PercentageThreshold:
      if (!threshold) throw Error("createDecisionFormState: Missing decision threshold");
      return {
        type: DecisionType.PercentageThreshold,
        threshold,
        defaultDecision,
        conditions,
      };
    case DecisionType.WeightedAverage:
      return {
        type: DecisionType.WeightedAverage,
        defaultDecision,
        conditions,
      };
    case DecisionType.Ai:
      return {
        type: DecisionType.Ai,
        criteria: decision.criteria ?? "",
        defaultDecision,
        conditions,
      };
  }
};
