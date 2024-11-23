import * as z from "zod";

import { DecisionType, ResultType } from "@/graphql/generated/graphql";

export type ResultSchemaType = z.infer<typeof resultSchema>;
export type ResultsSchemaType = z.infer<typeof resultsSchema>;
export type DecisionSchemaType = z.infer<typeof decisionSchema>;

export type DecisionResultSchemaType = z.infer<typeof decisionResultSchema>;
export type LlmSummaryResultSchemaType = z.infer<typeof llmResultSchema>;
export type RankingResultSchemaType = z.infer<typeof rankingResultSchema>;
export type RawAnswersResultSchemaType = z.infer<typeof rawAnswersResultSchema>;

export enum ResultListCountLimit {
  None = "None",
}

const defaultDecisionSchema = z
  .object({
    hasDefault: z.boolean().default(false),
    optionId: z.string().nullable().default(null),
  })
  .refine(
    (defaultDecision) => {
      if (defaultDecision.hasDefault && !defaultDecision.optionId) return false;
      else return true;
    },
    {
      message: "Select a default option",
      path: ["optionId"],
    },
  )
  .optional();

export const decisionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(DecisionType.NumberThreshold),
    defaultDecision: defaultDecisionSchema,
    threshold: z.coerce.number().int().positive(),
  }),
  z.object({
    type: z.literal(DecisionType.PercentageThreshold),
    defaultDecision: defaultDecisionSchema,
    threshold: z.coerce.number().int().min(51).max(100),
  }),
  z.object({
    type: z.literal(DecisionType.WeightedAverage),
    defaultDecision: defaultDecisionSchema,
  }),
  z.object({
    type: z.literal(DecisionType.Ai),
    defaultDecision: defaultDecisionSchema,
    criteria: z.string(),
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
  isList: z.boolean(),
});

const decisionResultSchema = z.object({
  type: z.literal(ResultType.Decision),
  resultConfigId: z.string().uuid(),
  fieldId: z.string().uuid(),
  decision: decisionSchema,
});

const llmResultSchema = z.object({
  type: z.literal(ResultType.LlmSummary),
  resultConfigId: z.string().uuid(),
  fieldId: z.string().uuid(),
  llmSummary: llmSchema,
});

const rankingResultSchema = z.object({
  type: z.literal(ResultType.Ranking),
  resultConfigId: z.string().uuid(),
  fieldId: z.string().uuid(),
  prioritization: prioritizationSchema,
});

const rawAnswersResultSchema = z.object({
  type: z.literal(ResultType.RawAnswers),
  resultConfigId: z.string().uuid(),
  fieldId: z.string().uuid(),
});

export const resultSchema = z.discriminatedUnion("type", [
  decisionResultSchema,
  rankingResultSchema,
  llmResultSchema,
  rawAnswersResultSchema,
]);
// .refine(
//   (result) => {
//     if (result.type !== ResultType.Decision && result.minimumAnswers < 2) return false;
//     return true;
//   },
//   { message: "There must be at least 2 responses to create a result" },
// );

export const resultsSchema = z.array(resultSchema).default([]);
