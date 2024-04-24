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

  const optionCount: { [key: string]: number } = {};

  answers.forEach((a) => {
    a.AnswerOptionSelections.forEach((o) => {
      optionCount[o.fieldOptionId] = (optionCount[o.fieldOptionId] || 0) + 1;
    });
  });

  const totalAnswerCount = answers.length;

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
  }
  return decisionOptionId;
};
