import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ResultConfigDecisionPrismaType } from "../resultPrismaTypes";
import { DecisionType } from "@/graphql/generated/resolver-types";

export const determineDecision = ({
  decisionConfig,
  answers,
}: {
  decisionConfig: ResultConfigDecisionPrismaType;
  answers: FieldAnswerPrismaType[];
}): string | null => {
  let decisionOptionId: string | null = null;

  const totalAnswerCount = answers.length;

  const optionCount = getOptionWeights({ answers });

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
    case DecisionType.WeightedAverage: {
      console.log("inside weighted average");
      let maxWeight: number = 0;
      let maxWeightOptionId: string | null = null;
      // find the option with the heightest count
      for (const [optionId, count] of Object.entries(optionCount)) {
        console.log("evaluating option", optionId, count);
        if (!maxWeightOptionId || maxWeight < count) {
          maxWeight = count;
          maxWeightOptionId = optionId;
        }
      }
      console.log("maxWeightOptionId", maxWeightOptionId);
      decisionOptionId = maxWeightOptionId;
      break;
    }
  }
  console.log("decisionOptionId", decisionOptionId);
  return decisionOptionId;
};

// generic function for determining relative priority between options
// for a single select or multiselect, all weights will be 1, so this is effectively an option count
// for a ranking, there are higher weights for higher ranked options
const getOptionWeights = ({
  answers,
}: {
  answers: FieldAnswerPrismaType[];
}): { [key: string]: number } => {
  const optionCount: { [key: string]: number } = {};

  answers.forEach((a) => {
    a.AnswerOptionSelections.forEach((o) => {
      optionCount[o.fieldOptionId] = (optionCount[o.fieldOptionId] || 0) + o.weight;
    });
  });
  return optionCount;
};
