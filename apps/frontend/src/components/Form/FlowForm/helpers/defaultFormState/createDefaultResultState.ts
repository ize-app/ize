import { DecisionType, ResultType } from "@/graphql/generated/graphql";

import { ResultSchemaType } from "../../formValidation/result";

interface DefaultResultStateProps {
  resultType: ResultType;
  fieldId: string;
}

export const createDefaultResultState = ({
  resultType,
  fieldId,
}: DefaultResultStateProps): ResultSchemaType => {
  switch (resultType) {
    case ResultType.Decision:
      return {
        resultId: crypto.randomUUID(),
        type: ResultType.Decision,
        fieldId,

        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
          defaultDecision: {
            hasDefault: false,
            optionId: null,
          },
        },
      };
    case ResultType.Ranking:
      return {
        resultId: crypto.randomUUID(),
        type: ResultType.Ranking,
        fieldId,

        prioritization: { numPrioritizedItems: 3 },
      };
    case ResultType.LlmSummary:
      return {
        resultId: crypto.randomUUID(),
        type: ResultType.LlmSummary,
        fieldId,
        llmSummary: {
          prompt: "",
          isList: false,
        },
      };
  }
};
