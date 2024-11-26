import dayjs, { Dayjs } from "dayjs";
import * as z from "zod";

import { FieldDataType, FieldType, OptionSelectionType } from "@/graphql/generated/graphql";

import { entityFormSchema } from "./entity";
import { flowSummarySchema } from "./flowSummary";

export type FieldAnswerSchemaType = z.infer<typeof fieldAnswerSchema>;
export type FieldAnswerRecordSchemaType = z.infer<typeof fieldAnswerRecordSchema>;

export type InputSchemaType = z.infer<typeof inputSchema>;
export type InputRecordSchemaType = z.infer<typeof inputRecordSchema>;

export type OptionSelectionsSchemaType = z.infer<typeof optionSelectionsSchema>;
export type OptionSelectionSchemaType = z.infer<typeof optionSelectionSchema>;

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

export const evaluateMultiTypeInput = (
  value: string,
  type: FieldDataType,
  errorPath: (string | number)[],
  ctx: z.RefinementCtx,
) => {
  switch (type) {
    case FieldDataType.Uri:
      if (!z.string().url().safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid Url",
          path: errorPath,
        });
      return;
    case FieldDataType.String:
      if (!z.string().min(1).safeParse(value).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid text",
          path: errorPath,
        });
      }
      return;
    case FieldDataType.Number:
      if (!z.number().or(z.string().min(1)).pipe(z.coerce.number()).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid number",
          path: errorPath,
        });
      return;
    case FieldDataType.Date:
      if (!zodDay.safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date",
          path: errorPath,
        });
      return;
    case FieldDataType.DateTime:
      if (!zodDay.safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid datetime",
          path: errorPath,
        });
      return;
    case FieldDataType.EntityIds:
      if (!z.array(entityFormSchema).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid groups and identities",
          path: errorPath,
        });
      return;
    case FieldDataType.FlowIds:
      if (!z.array(flowSummarySchema).safeParse(value).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid flows.",
          path: errorPath,
        });
      }
      return;
    default:
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Unknown option",
        path: errorPath,
      });
      return;
  }
};
export const optionSelectionSchema = z.object({ optionId: z.string().min(1) });
export const optionSelectionsSchema = z.array(optionSelectionSchema);

const fieldAnswerSchema = z
  .object({
    dataType: z.nativeEnum(FieldDataType).optional(),
    maxSelections: z.number().nullable().optional(),
    selectionType: z.nativeEnum(OptionSelectionType).optional(),
    value: z.any(),
    optionSelections: optionSelectionsSchema.optional(),
    required: z.boolean().optional(),
  })
  .superRefine((field, ctx) => {
    if (
      field.maxSelections &&
      field.optionSelections &&
      field.maxSelections < field.optionSelections.length
    ) {
      console.log("Error: option selections exceeded");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only a maximum of " + field.maxSelections + " selections are allowed",
        path: ["optionSelections"],
      });
    }
  })
  .superRefine((field, ctx) => {
    if (!field?.required && !field.value) return;
    if (!field.dataType) return;
    //eslint-disable-next-line
    evaluateMultiTypeInput(field.value, field.dataType, ["value"], ctx);
  });

export const fieldAnswerRecordSchema = z.record(z.string().min(1), fieldAnswerSchema);

///////////////////////

export const optionInputSchema = z.object({
  type: z.literal(FieldType.Options),
  value: optionSelectionsSchema,
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
    optionInputSchema,
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

export const inputRecordSchema = z.record(z.string().min(1), inputSchema);
