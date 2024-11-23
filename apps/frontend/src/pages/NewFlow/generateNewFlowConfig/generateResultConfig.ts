import {
  DecisionSchemaType,
  ResultSchemaType,
} from "@/components/Form/FlowForm/formValidation/result";
import { DecisionType, ResultType } from "@/graphql/generated/graphql";

type ResultArgs =
  | {
      type: ResultType.Decision;
      decisionType: DecisionType;
      fieldId: string;
      criteria: string | undefined;
    }
  | {
      type: ResultType.Ranking;
      fieldId: string;
    }
  | {
      type: ResultType.LlmSummary;
      fieldId: string;
      prompt: string;
      isList: boolean;
    };

const generateDecisionConfig = ({
  decisionType,
  criteria,
}: {
  decisionType: DecisionType;
  criteria?: string;
}): DecisionSchemaType => {
  const defaultDecision = { hasDefault: false, optionId: null };
  switch (decisionType) {
    case DecisionType.NumberThreshold:
      return {
        type: DecisionType.NumberThreshold,
        threshold: 1,
        defaultDecision,
      };
    case DecisionType.PercentageThreshold:
      return {
        type: DecisionType.PercentageThreshold,
        threshold: 51,
        defaultDecision,
      };
    case DecisionType.Ai:
      return {
        type: DecisionType.Ai,
        criteria: criteria ?? "",
        defaultDecision,
      };
    case DecisionType.WeightedAverage:
      return {
        type: DecisionType.WeightedAverage,
        defaultDecision: {
          hasDefault: false,
          optionId: null,
        },
      };
    default:
      throw new Error("Invalid DecisionType");
  }
};

export function generateResultConfig(arg: ResultArgs): ResultSchemaType {
  const base = {
    resultId: crypto.randomUUID(),
    fieldId: arg.fieldId,
    minimumAnswers: 1,
  };
  switch (arg.type) {
    case ResultType.Decision: {
      return {
        resultConfigId: crypto.randomUUID(),
        type: ResultType.Decision,
        ...base,
        decision: generateDecisionConfig({
          decisionType: arg.decisionType,
          criteria: arg.criteria,
        }),
      };
    }
    case ResultType.Ranking:
      return {
        resultConfigId: crypto.randomUUID(),
        type: ResultType.Ranking,
        ...base,
        prioritization: {
          numPrioritizedItems: 3,
        },
      };
    case ResultType.LlmSummary: {
      return {
        resultConfigId: crypto.randomUUID(),
        type: ResultType.LlmSummary,
        ...base,
        llmSummary: {
          prompt: arg.prompt,
          isList: arg.isList,
        },
      };
    }
    default:
      throw new Error("Invalid ResultType");
  }
}
