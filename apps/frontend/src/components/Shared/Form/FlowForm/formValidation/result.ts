import * as z from "zod";
import { ResultType, DecisionType } from "@/graphql/generated/graphql";

export type ResultSchemaType = z.infer<typeof resultSchema>;
export type ResultsSchemaType = z.infer<typeof resultsSchema>;

export enum LlmSummaryType {
  AfterEveryResponse = "AfterEveryResponse",
  AtTheEnd = "AtTheEnd",
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
]);

const prioritizationSchema = z.object({
  numOptionsToInclude: z.coerce.number().int().positive(),
});

const llmSchema = z.object({
  type: z.nativeEnum(LlmSummaryType),
  prompt: z.string().optional(),
});

export const resultSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ResultType.Decision),
    resultId: z.string(),
    fieldId: z.string().nullable(),
    minimumAnswers: z.coerce.number().int().positive().default(1),
    decision: decisionSchema,
  }),
  z.object({
    type: z.literal(ResultType.Ranking),
    resultId: z.string(),
    fieldId: z.string().nullable(),
    minimumAnswers: z.coerce.number().default(1),
    prioritization: prioritizationSchema,
  }),
  z.object({
    type: z.literal(ResultType.LlmSummary),
    resultId: z.string(),
    fieldId: z.string().nullable(),
    minimumAnswers: z.coerce.number().int().positive().default(1),
    llmSummary: llmSchema,
  }),
]);

export const resultsSchema = z.array(resultSchema).default([]);
