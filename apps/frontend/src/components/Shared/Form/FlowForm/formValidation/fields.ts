import * as z from "zod";

import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";
import dayjs, { Dayjs } from "dayjs";

export type FieldOptionSchemaType = z.infer<typeof fieldOptionSchema>;
export type FieldOptionsSchemaType = z.infer<typeof fieldOptionsSchema>;
export type FieldSchemaType = z.infer<typeof fieldSchema>;
export type FieldsSchemaType = z.infer<typeof fieldsSchema>;

export enum DefaultOptionSelection {
  None = "None",
}

const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");

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
      if (!z.string().min(1).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid text",
          path: errorPath,
        });
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
    default:
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Unknown option",
        path: errorPath,
      });
      return;
  }
};

export const fieldOptionSchema = z
  .object({
    optionId: z.string(),
    name: z.any(),
    dataType: z.nativeEnum(FieldDataType),
  })
  .superRefine((option, ctx) => {
    evaluateMultiTypeInput(option.name, option.dataType, ["name"], ctx);
  })
  .transform((option) => ({
    ...option,
    name: option.name.toString(),
  }));

const fieldOptionsSchema = z
  .object({
    previousStepOptions: z.boolean().default(false),
    hasRequestOptions: z.boolean().default(false),
    requestOptionsDataType: z.nativeEnum(FieldDataType).optional(), // refers only to request created options
    selectionType: z.nativeEnum(FieldOptionsSelectionType),
    maxSelections: z.coerce.number().default(1),
    options: z.array(fieldOptionSchema).default([]),
  })
  .refine(
    (requestOptions) => {
      if (requestOptions.hasRequestOptions && !requestOptions.requestOptionsDataType) {
        return false;
      }
      return true;
    },
    { path: ["dataType"], message: "Select a data type" },
  )
  .refine(
    (options) => {
      if (options.selectionType === FieldOptionsSelectionType.MultiSelect && !options.maxSelections)
        return false;
      return true;
    },
    { path: ["maxSelectableOptions"], message: "Required" },
  );

export const fieldSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(FieldType.FreeInput),
      fieldId: z.string(),
      name: z.string().min(1),
      required: z.boolean().optional().default(true),
      freeInputDataType: z.nativeEnum(FieldDataType),
    }),
    z.object({
      type: z.literal(FieldType.Options),
      fieldId: z.string(),
      name: z.string().min(1),
      required: z.boolean().optional().default(true),
      optionsConfig: fieldOptionsSchema,
    }),
  ])
  .refine(
    (field) => {
      if (
        field.type === FieldType.Options &&
        (field.optionsConfig.options ?? []).length === 0 &&
        !field.optionsConfig.hasRequestOptions &&
        !field.optionsConfig.previousStepOptions
      )
        return false;
      return true;
    },
    { path: [""], message: "Add options" },
  );

export const fieldsSchema = z.array(fieldSchema).default([]);
