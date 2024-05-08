import * as z from "zod";
import { ResultType, DecisionType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "./fields";

export type ResultSchemaType = z.infer<typeof resultSchema>;
export type ResultsSchemaType = z.infer<typeof resultsSchema>;
export type DecisionResultSchemaType = z.infer<typeof decisionResultSchema>;
export type LlmSummaryResultSchemaType = z.infer<typeof llmResultSchema>;
export type RankingResultSchemaType = z.infer<typeof rankingResultSchema>;

export enum LlmSummaryType {
  AfterEveryResponse = "AfterEveryResponse",
  AtTheEnd = "AtTheEnd",
}

export enum ResultListCountLimit {
  None = "None",
}

export const decisionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(DecisionType.NumberThreshold),
    defaultOptionId: z.string().optional(),
    threshold: z.coerce.number().int().positive(),
  }),
  z.object({
    type: z.literal(DecisionType.PercentageThreshold),
    defaultOptionId: z.string().optional(),
    threshold: z.coerce.number().int().min(51).max(100),
  }),
  z.object({
    type: z.literal(DecisionType.WeightedAverage),
    defaultOptionId: z.string().optional(),
  }),
]);

const prioritizationSchema = z.object({
  numPrioritizedItems: z
    .number()
    .or(z.nativeEnum(ResultListCountLimit))
    .transform((val) => {
      if (val === ResultListCountLimit.None) return null;
      return val;
    })
    .pipe(z.coerce.number().positive())
    .nullable(),
});

const llmSchema = z.object({
  prompt: z.string().optional(),
});

const decisionResultSchema = z.object({
  type: z.literal(ResultType.Decision),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  minimumAnswers: z.coerce.number().int().positive().default(1),
  decision: decisionSchema,
});

const llmResultSchema = z.object({
  type: z.literal(ResultType.LlmSummary),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  minimumAnswers: z.coerce.number().int().positive().default(1),
  llmSummary: llmSchema,
});

const rankingResultSchema = z.object({
  type: z.literal(ResultType.Ranking),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  minimumAnswers: z.coerce.number().default(1),
  prioritization: prioritizationSchema,
});

export const resultSchema = z.discriminatedUnion("type", [
  decisionResultSchema,
  rankingResultSchema,
  llmResultSchema,
]);

export const resultsSchema = z.array(resultSchema).default([]);

export const defaultDecisionResult = (
  stepIndex: number,
  resultIndex: number,
  fieldId: string,
): ResultSchemaType => ({
  resultId: "new." + stepIndex + "." + resultIndex,
  type: ResultType.Decision,
  fieldId,
  minimumAnswers: 1,
  decision: {
    type: DecisionType.NumberThreshold,
    threshold: 1,
    defaultOptionId: DefaultOptionSelection.None,
  },
});

export const defaultRankingResult = (
  stepIndex: number,
  resultIndex: number,
  fieldId: string,
): ResultSchemaType => ({
  resultId: "new." + stepIndex + "." + resultIndex,
  type: ResultType.Ranking,
  fieldId,
  minimumAnswers: 1,
  prioritization: { numPrioritizedItems: 3 },
});

export const defaultLlmSummaryResult = (
  stepIndex: number,
  resultIndex: number,
  fieldId: string,
): ResultSchemaType => ({
  resultId: "new." + stepIndex + "." + resultIndex,
  type: ResultType.LlmSummary,
  fieldId,
  minimumAnswers: 1,
  llmSummary: {
    prompt: "test prmpt",
  },
});
