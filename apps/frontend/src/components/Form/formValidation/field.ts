import dayjs, { Dayjs } from "dayjs";
import * as z from "zod";

import { FieldDataType, OptionSelectionType } from "@/graphql/generated/graphql";

import { entityFormSchema } from "./entity";
import { flowSummarySchema } from "./flowSummary";

export type FieldAnswerSchemaType = z.infer<typeof fieldAnswerSchema>;
export type FieldAnswerRecordSchemaType = z.infer<typeof fieldAnswerRecordSchema>;

export type OptionSelectionsSchemaType = z.infer<typeof optionSelectionsSchema>;
export type OptionSelectionSchemaType = z.infer<typeof optionSelectionSchema>;

export const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");

// export const freeInputSchema = z.discriminatedUnion("type", [
//   z.object({
//     type: z.literal(FieldDataType.Date),
//     value: z.string(),
//   }),
//   z.object({
//     type: z.literal(FieldDataType.Date),
//     value: z.string(),
//   }),
// ]);


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
