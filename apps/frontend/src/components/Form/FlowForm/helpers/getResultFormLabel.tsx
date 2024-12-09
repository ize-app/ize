import { ResultType } from "@/graphql/generated/graphql";

import { ResultSchemaType } from "../formValidation/result";

interface ResultLabelConfigProps {
  result: ResultSchemaType | undefined;
}

// note: this mirrors getResultConfigName on the backend
export const getResultFormLabel = ({ result }: ResultLabelConfigProps) => {
  if (!result) return "Collaborative step";
  switch (result.type) {
    case ResultType.Decision: {
      return "Decision";
    }
    case ResultType.Ranking:
      return "Prioritize";
    case ResultType.LlmSummary: {
      if (result.llmSummary && result.llmSummary.isList) return "Collect ideas (AI refined)";
      else return "Create consensus w/ AI";
    }
    case ResultType.RawAnswers:
      return "Collect ideas";

    default:
      return "Collaborative step";
  }
};
