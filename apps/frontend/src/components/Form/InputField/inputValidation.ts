import dayjs, { Dayjs } from "dayjs";
import * as z from "zod";

import { OptionSelectionType, ValueType } from "@/graphql/generated/graphql";

import { entityFormSchema } from "../formValidation/entity";
import { flowReferenceSchema } from "../formValidation/flowSummary";

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
export const optionSelectionValuesSchema = z.array(optionSelectionValueSchema).default([]);

export const inputSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(ValueType.String),
      required: z.boolean().default(true),
      value: z.string().min(1, { message: "Invalid text" }).default(""),
    }),
    z.object({
      type: z.literal(ValueType.Float),
      required: z.boolean().default(true),
      value: z.number().or(z.string().min(1)).pipe(z.coerce.number()).default(""),
    }),
    z.object({
      type: z.literal(ValueType.Uri),
      required: z.boolean().default(true),
      value: z
        .object({ uri: z.string().url(), name: z.string().min(1) })
        .default({ uri: "", name: "" }),
    }),
    z.object({
      type: z.literal(ValueType.Date),
      required: z.boolean().default(true),
      value: dayjsSchema.default(dayjs()),
    }),
    z.object({
      type: z.literal(ValueType.DateTime),
      required: z.boolean().default(true),
      value: dayjsSchema.default(dayjs()),
    }),
    z.object({
      type: z.literal(ValueType.Entities),
      required: z.boolean().default(true),
      value: z.array(entityFormSchema).default([]),
    }),
    z.object({
      type: z.literal(ValueType.Flows),
      required: z.boolean().default(true),
      value: z.array(flowReferenceSchema).default([]),
    }),
    z.object({
      type: z.literal(ValueType.FlowVersion),
      required: z.boolean().default(true),
      value: flowReferenceSchema,
    }),
    z.object({
      type: z.literal(ValueType.OptionSelections),
      value: optionSelectionValuesSchema,
      required: z.boolean().default(true),
      maxSelections: z.number().nullable(),
      selectionType: z.nativeEnum(OptionSelectionType),
    }),
  ])
  .superRefine((field, ctx) => {
    if (field.type === ValueType.OptionSelections) {
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
