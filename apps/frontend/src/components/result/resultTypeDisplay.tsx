import { ResultType } from "@/graphql/generated/graphql";
type ResultTypeDisplay = {
  [key in ResultType]: string;
};

export const resultTypeDisplay: ResultTypeDisplay = {
  [ResultType.Decision]: "Decision",
  [ResultType.Ranking]: "Ranking",
  [ResultType.LlmSummary]: "AI Lummary",
  [ResultType.LlmSummaryList]: "AI List",
};
