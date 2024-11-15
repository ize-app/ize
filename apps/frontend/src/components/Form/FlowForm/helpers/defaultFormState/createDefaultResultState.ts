import { DecisionType, ResultType } from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "../../formValidation/fields";
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
        minimumAnswers: 1,
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
          defaultOptionId: DefaultOptionSelection.None,
        },
      };
    case ResultType.Ranking:
      return {
        resultId: crypto.randomUUID(),
        type: ResultType.Ranking,
        fieldId,
        minimumAnswers: 2,
        prioritization: { numPrioritizedItems: 3 },
      };
    case ResultType.LlmSummary:
      return {
        resultId: crypto.randomUUID(),
        type: ResultType.LlmSummary,
        fieldId,
        minimumAnswers: 2,
        llmSummary: {
          prompt: "",
        },
      };
    case ResultType.LlmSummaryList:
      return {
        resultId: crypto.randomUUID(),
        type: ResultType.LlmSummaryList,
        fieldId,
        minimumAnswers: 2,
        llmSummary: {
          prompt: "",
        },
      };
  }
};
