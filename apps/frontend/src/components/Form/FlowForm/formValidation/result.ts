import * as z from "zod";

import { DecisionType, ResultType } from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "./fields";

export type ResultSchemaType = z.infer<typeof resultSchema>;
export type ResultsSchemaType = z.infer<typeof resultsSchema>;
export type DecisionSchemaType = z.infer<typeof decisionSchema>;
export type DecisionResultSchemaType = z.infer<typeof decisionResultSchema>;
export type LlmSummaryResultSchemaType = z.infer<typeof llmResultSchema>;
export type LlmSummaryListResultSchemaType = z.infer<typeof llmListResultSchema>;
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
    defaultOptionId: z.string().default(DefaultOptionSelection.None),
  }),
  z.object({
    type: z.literal(DecisionType.Ai),
    criteria: z.string().optional(),
    defaultOptionId: z.string().default(DefaultOptionSelection.None),
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
  prompt: z.string(),
});

const decisionResultSchema = z.object({
  type: z.literal(ResultType.Decision),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  decision: decisionSchema,
});

const llmResultSchema = z.object({
  type: z.literal(ResultType.LlmSummary),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  llmSummary: llmSchema,
});

const llmListResultSchema = z.object({
  type: z.literal(ResultType.LlmSummaryList),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  llmSummary: llmSchema,
});

const rankingResultSchema = z.object({
  type: z.literal(ResultType.Ranking),
  resultId: z.string(),
  fieldId: z.string().nullable(),
  prioritization: prioritizationSchema,
});

export const resultSchema = z.discriminatedUnion("type", [
  decisionResultSchema,
  rankingResultSchema,
  llmResultSchema,
  llmListResultSchema,
]);
// .refine(
//   (result) => {
//     if (result.type !== ResultType.Decision && result.minimumAnswers < 2) return false;
//     return true;
//   },
//   { message: "There must be at least 2 responses to create a result" },
// );

export const resultsSchema = z.array(resultSchema).default([]);
