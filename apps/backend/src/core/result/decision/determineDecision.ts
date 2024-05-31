import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { DecisionType } from "@/graphql/generated/resolver-types";

import { ResultConfigDecisionPrismaType } from "../resultPrismaTypes";
import { calculateAggregateOptionWeights } from "../utils/calculateAggregateOptionWeights";

export const determineDecision = ({
  decisionConfig,
  answers,
}: {
  decisionConfig: ResultConfigDecisionPrismaType;
  answers: FieldAnswerPrismaType[];
}): string | null => {
  let decisionOptionId: string | null = null;

  const totalAnswerCount = answers.length;

  const optionCount = calculateAggregateOptionWeights({ answers });

  switch (decisionConfig.type) {
    case DecisionType.NumberThreshold: {
      for (const [optionId, count] of Object.entries(optionCount)) {
        if (!decisionConfig.threshold) throw new Error("Threshold is undefined");
        if (count >= decisionConfig.threshold) {
          decisionOptionId = optionId;
          break;
        }
      }
      break;
    }
    case DecisionType.PercentageThreshold: {
      if (!decisionConfig.threshold) throw new Error("Threshold is undefined");
      const threshold = Math.ceil((decisionConfig.threshold / 100) * totalAnswerCount);
      for (const [optionId, count] of Object.entries(optionCount)) {
        if (count >= threshold) {
          decisionOptionId = optionId;
          break;
        }
      }
      break;
    }
    // note: if there is a tie, this arbitarily picks the first option
    case DecisionType.WeightedAverage: {
      let maxWeight: number = 0;
      let maxWeightOptionId: string | null = null;
      // find the option with the heightest count
      for (const [optionId, count] of Object.entries(optionCount)) {
        if (!maxWeightOptionId || maxWeight < count) {
          maxWeight = count;
          maxWeightOptionId = optionId;
        }
      }
      decisionOptionId = maxWeightOptionId;
      break;
    }
  }
  return decisionOptionId;
};
