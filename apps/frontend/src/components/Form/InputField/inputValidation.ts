import dayjs, { Dayjs } from "dayjs";
import * as z from "zod";

import { FieldDataType, FieldType, OptionSelectionType } from "@/graphql/generated/graphql";

import { entityFormSchema } from "../formValidation/entity";
import { flowSummarySchema } from "../formValidation/flowSummary";

export type InputSchemaType = z.infer<typeof inputSchema>;
export type InputRecordSchemaType = z.infer<typeof inputRecordSchema>;

export type OptionSelectionValuesSchemaType = z.infer<typeof optionSelectionValuesSchema>;
export type OptionSelectionValueSchemaType = z.infer<typeof optionSelectionValueSchema>;
export type OptionSchemaType = z.infer<typeof optionSchema>;

export const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");

const dayjsSchema = z.custom<dayjs.Dayjs>((value) => dayjs.isDayjs(value), {
  message: "Invalid Day.js object",
});

// the actual values that are selected on an options field
export const optionSelectionValueSchema = z.object({ optionId: z.string().min(1) });
export const optionSelectionValuesSchema = z.array(optionSelectionValueSchema);

export const optionSelectionInputSchema = z.object({
  type: z.literal(FieldType.Options),
  value: optionSelectionValuesSchema,
  required: z.boolean().default(true),
  maxSelections: z.number().nullable().optional(),
  selectionType: z.nativeEnum(OptionSelectionType).optional(),
});

export const inputSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(FieldDataType.String),
      required: z.boolean().default(true),
      value: z.string().min(1, { message: "Invalid text" }).default(""),
    }),
    z.object({
      type: z.literal(FieldDataType.Number),
      required: z.boolean().default(true),
      value: z.number().or(z.string().min(1)).pipe(z.coerce.number()).default(""),
    }),
    z.object({
      type: z.literal(FieldDataType.Uri),
      required: z.boolean().default(true),
      value: z.string().url().default(""),
    }),
    z.object({
      type: z.literal(FieldDataType.Date),
      required: z.boolean().default(true),
      value: dayjsSchema.default(dayjs()),
    }),
    z.object({
      type: z.literal(FieldDataType.DateTime),
      required: z.boolean().default(true),
      value: dayjsSchema.default(dayjs()),
    }),
    z.object({
      type: z.literal(FieldDataType.FlowIds),
      required: z.boolean().default(true),
      value: z.array(flowSummarySchema).default([]),
    }),
    z.object({
      type: z.literal(FieldDataType.EntityIds),
      required: z.boolean().default(true),
      value: z.array(entityFormSchema).default([]),
    }),
    // TODO: this shouldn't happen on FE
    z.object({
      type: z.literal(FieldDataType.FlowVersionId),
      required: z.boolean().default(true),
      value: z.string().min(1, { message: "Invalid text" }).default(""),
    }),
    optionSelectionInputSchema,
  ])
  .superRefine((field, ctx) => {
    if (field.type === FieldType.Options) {
      if (field.maxSelections && field.maxSelections < field.value.length) {
        console.log("Error: option selections exceeded");
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only a maximum of " + field.maxSelections + " selections are allowed",
          path: ["optionSelections"],
        });
      }
    }
  });

export const optionSchema = z.object({
  optionId: z.string().uuid(),
  input: inputSchema,
});

export const inputRecordSchema = z.record(z.string().min(1), inputSchema);
