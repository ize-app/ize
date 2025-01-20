import { DecisionType, ResultType } from "@/graphql/generated/graphql";

import {
  DecisionResultSchemaType,
  LlmSummaryResultSchemaType,
  RankingResultSchemaType,
  RawAnswersResultSchemaType,
  ResultSchemaType,
} from "../../formValidation/result";

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
        resultConfigId: crypto.randomUUID(),
        type: ResultType.Decision,
        fieldId,
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
          conditions: [],
          defaultDecision: {
            hasDefault: false,
            optionId: null,
          },
        },
      } as DecisionResultSchemaType;
    case ResultType.Ranking:
      return {
        resultConfigId: crypto.randomUUID(),
        type: ResultType.Ranking,
        fieldId,

        prioritization: { numPrioritizedItems: 3 },
      } as RankingResultSchemaType;
    case ResultType.LlmSummary:
      return {
        resultConfigId: crypto.randomUUID(),
        type: ResultType.LlmSummary,
        fieldId,
        llmSummary: {
          prompt: "",
          isList: false,
        },
      } as LlmSummaryResultSchemaType;
    case ResultType.RawAnswers:
      return {
        resultConfigId: crypto.randomUUID(),
        type: ResultType.RawAnswers,
        fieldId,
      } as RawAnswersResultSchemaType;
  }
};
