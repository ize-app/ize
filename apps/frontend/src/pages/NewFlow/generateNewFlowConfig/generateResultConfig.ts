import { DefaultOptionSelection } from "@/components/Form/FlowForm/formValidation/fields";
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
    }
  | {
      type: ResultType.Ranking;
      fieldId: string;
    }
  | {
      type: ResultType.LlmSummary;
      fieldId: string;
      prompt: string;
      example: string;
    }
  | {
      type: ResultType.LlmSummaryList;
      fieldId: string;
      prompt: string;
      example: string;
    };

const generateDecisionConfig = ({
  decisionType,
}: {
  decisionType: DecisionType;
}): DecisionSchemaType => {
  switch (decisionType) {
    case DecisionType.NumberThreshold:
      return {
        type: DecisionType.NumberThreshold,
        threshold: 2,
        defaultOptionId: DefaultOptionSelection.None,
      };
    case DecisionType.PercentageThreshold:
      return {
        type: DecisionType.PercentageThreshold,
        threshold: 51,
        defaultOptionId: DefaultOptionSelection.None,
      };
    case DecisionType.Ai:
      return {
        type: DecisionType.Ai,
        criteria: "",
        defaultOptionId: DefaultOptionSelection.None,
      };
    case DecisionType.WeightedAverage:
      return {
        type: DecisionType.WeightedAverage,
        defaultOptionId: DefaultOptionSelection.None,
      };
    default:
      throw new Error("Invalid DecisionType");
  }
};

export function generateResultConfig(arg: ResultArgs): ResultSchemaType {
  const base = {
    resultId: crypto.randomUUID(),
    fieldId: arg.fieldId,
    minimumAnswers: 2,
  };
  switch (arg.type) {
    case ResultType.Decision: {
      return {
        type: ResultType.Decision,
        ...base,
        decision: generateDecisionConfig({ decisionType: arg.decisionType }),
      };
    }
    case ResultType.Ranking:
      return {
        type: ResultType.Ranking,
        ...base,
        prioritization: {
          numPrioritizedItems: 3,
        },
      };
    case ResultType.LlmSummary: {
      return {
        type: ResultType.LlmSummary,
        ...base,
        llmSummary: {
          prompt: arg.prompt,
          example: arg.example,
        },
      };
    }
    case ResultType.LlmSummaryList: {
      return {
        type: ResultType.LlmSummaryList,
        ...base,
        llmSummary: {
          prompt: arg.prompt,
          example: arg.example,
        },
      };
    }
    default:
      throw new Error("Invalid ResultType");
  }
}
