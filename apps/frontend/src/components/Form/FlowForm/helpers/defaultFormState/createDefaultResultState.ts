import { DecisionType, ResultType } from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "../../formValidation/fields";
import { ResultSchemaType } from "../../formValidation/result";

interface DefaultResultStateProps {
  resultType: ResultType;
  stepIndex: number;
  fieldId: string;
  resultIndex: number;
}

export const createDefaultResultState = ({
  resultType,
  fieldId,
  stepIndex,
  resultIndex,
}: DefaultResultStateProps): ResultSchemaType => {
  switch (resultType) {
    case ResultType.Decision:
      return {
        resultId: "new." + stepIndex + "." + resultIndex,
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
        resultId: "new." + stepIndex + "." + resultIndex,
        type: ResultType.Ranking,
        fieldId,
        minimumAnswers: 1,
        prioritization: { numPrioritizedItems: 3 },
      };
    case ResultType.LlmSummary:
      return {
        resultId: "new." + stepIndex + "." + resultIndex,
        type: ResultType.LlmSummary,
        fieldId,
        minimumAnswers: 1,
        llmSummary: {
          prompt:
            "Write a summary of all the responses that describes the overall thoughts and sentiment of the group, common points of disagreement, and next steps.",
          example: undefined, // "Overall, the group was in agreement that it is OK to where socks and sandals. Most agree that socks and sandals optimizes for comfort, warmth and hygiene. A few noted that socks and sandals can be a daring and ironic fashion choice. Others remain convinced that socks with sandals is a fatal fashion faux pas that must be avoided at all costs, though socks with certain kinds of sandals may acceptable. Further discussion may be warranted to understand the types of sandals that are appropriate to wear with socks. "
        },
      };
    case ResultType.LlmSummaryList:
      return {
        resultId: "new." + stepIndex + "." + resultIndex,
        type: ResultType.LlmSummaryList,
        fieldId,
        minimumAnswers: 1,
        llmSummary: {
          prompt: "Synthesize the responses into a list of conise key points.",
          example: undefined,
        },
      };
  }
};
