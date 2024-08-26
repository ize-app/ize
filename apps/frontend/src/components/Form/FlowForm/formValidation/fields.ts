import * as z from "zod";

import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { evaluateMultiTypeInput } from "../../formValidation/field";

export type FieldOptionSchemaType = z.infer<typeof fieldOptionSchema>;
export type FieldOptionsSchemaType = z.infer<typeof fieldOptionsSchema>;
export type FieldSchemaType = z.infer<typeof fieldSchema>;
export type FieldsSchemaType = z.infer<typeof fieldsSchema>;

export enum DefaultOptionSelection {
  None = "None",
}

export enum DefaultFieldSelection {
  None = "None",
}

export enum OptionSelectionCountLimit {
  None = "None",
}

export const fieldOptionSchema = z
  .object({
    optionId: z.string(),
    name: z.any(),
    dataType: z.nativeEnum(FieldDataType),
  })
  .superRefine((option, ctx) => {
    evaluateMultiTypeInput(option.name, option.dataType, ["name"], ctx);
  });
// .transform((option) => ({
//   ...option,
//   name: option.name.toString(),
// }));

const fieldOptionsSchema = z
  .object({
    previousStepOptions: z.boolean().default(false),
    requestOptionsDataType: z.nativeEnum(FieldDataType).optional().nullable(), // refers only to request created options
    selectionType: z
      .nativeEnum(FieldOptionsSelectionType)
      .default(FieldOptionsSelectionType.Select),
    maxSelections: z
      .number()
      .or(z.nativeEnum(OptionSelectionCountLimit))
      .transform((val) => {
        if (val === OptionSelectionCountLimit.None) return null;
        return val;
      })
      .pipe(z.coerce.number())
      .nullable()
      .optional(),
    options: z.array(fieldOptionSchema).default([]),
    // array of resultConfig ids
    linkedResultOptions: z.array(z.object({ id: z.string().min(1) })).default([]),
  })
  .refine(
    (options) => {
      if (
        options.selectionType === FieldOptionsSelectionType.MultiSelect &&
        options.maxSelections === undefined
      )
        return false;
      return true;
    },
    { path: ["maxSelections"], message: "Required" },
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
        !field.optionsConfig.requestOptionsDataType &&
        field.optionsConfig.linkedResultOptions.length === 0
      )
        return false;
      return true;
    },
    { path: [""], message: "Add options or allow requestor to create their own options." },
  );

export const fieldsSchema = z.array(fieldSchema).default([]);
