import { ResultType } from "@prisma/client";

import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { DecisionType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { generateAiDecision } from "../../../openai/generateAiDecision";
import { ResultConfigPrismaType } from "../resultPrismaTypes";
import { calculateAggregateOptionWeights } from "../utils/calculateAggregateOptionWeights";

export interface DecisionResult {
  optionId: string | null;
  explanation: string | null;
}

export const determineDecision = async ({
  resultConfig,
  answers,
  requestStepId,
}: {
  resultConfig: ResultConfigPrismaType;
  answers: FieldAnswerPrismaType[];
  requestStepId: string;
}): Promise<DecisionResult> => {
  let decisionOptionId: string | null = null;
  let explanation: string | null = null;

  const decisionConfig = resultConfig.ResultConfigDecision;

  const defaultOptionId = decisionConfig?.defaultOptionId ?? null;

  if (resultConfig.resultType !== ResultType.Decision || !decisionConfig)
    throw new GraphQLError(
      `Cannot create decision result without a decision config. resultConfigId: ${resultConfig.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

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
    case DecisionType.Ai: {
      const { optionId, explanation: aiExplaination } = await generateAiDecision({
        resultConfig,
        requestStepId,
      });
      decisionOptionId = optionId;
      explanation = aiExplaination;
      break;
    }
  }
  return { optionId: decisionOptionId ?? defaultOptionId, explanation: explanation };
};
