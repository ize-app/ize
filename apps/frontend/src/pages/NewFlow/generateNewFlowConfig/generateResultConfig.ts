import { DefaultOptionSelection } from "@/components/Form/FlowForm/formValidation/fields";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import { DecisionType, ResultType } from "@/graphql/generated/graphql";

type ResultArgs =
  | {
      type: ResultType.Decision;
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
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 2,
          defaultOptionId: DefaultOptionSelection.None,
        },
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
