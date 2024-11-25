import {
  DecisionSchemaType,
  ResultSchemaType,
} from "@/components/Form/FlowForm/formValidation/result";
import { ResultType } from "@/graphql/generated/graphql";

type ResultArgs =
  | {
      type: ResultType.Decision;
      fieldId: string;
      decision: DecisionSchemaType;
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
    }
  | {
      type: ResultType.RawAnswers;
      fieldId: string;
    };

export function generateResultConfig(arg: ResultArgs): ResultSchemaType {
  const base = {
    resultConfigId: crypto.randomUUID(),
    fieldId: arg.fieldId,
    minimumAnswers: 1,
  };
  switch (arg.type) {
    case ResultType.Decision: {
      return {
        type: ResultType.Decision,
        ...base,
        decision: {
          ...arg.decision,
          defaultDecision: {
            hasDefault: false,
            optionId: null,
          },
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
          isList: arg.isList,
        },
      };
    }
    case ResultType.RawAnswers: {
      return {
        type: ResultType.RawAnswers,
        ...base,
      };
    }
    default:
      throw new Error("Invalid ResultType");
  }
}
