import * as z from "zod";

import { OptionSelectionType, SystemFieldType, ValueType } from "@/graphql/generated/graphql";

import { optionSchema } from "../../InputField/inputValidation";

export type FieldSchemaType = z.infer<typeof fieldSchema>;
export type FieldsSchemaType = z.infer<typeof fieldsSchema>;
export type FieldSetSchemaType = z.infer<typeof fieldSetSchema>;
export type TriggerDefinedOptionsSchemaType = z.infer<typeof triggerDefinedOptionsSchema>;

export enum OptionSelectionCountLimit {
  None = "None",
}

export enum FieldContextType {
  Trigger = "Trigger",
  Response = "Response",
}

export const triggerDefinedOptionsSchema = z
  .object({
    hasTriggerDefinedOptions: z.boolean().default(false),
    type: z.nativeEnum(ValueType).nullable().optional(),
  })
  .refine(
    (options) => {
      if (options.hasTriggerDefinedOptions && !options.type) return false;
      return true;
    },
    {
      message: "Select a data type for the trigger defined options.",
      path: ["hasTriggerDefinedOptions"],
    },
  )
  .optional();

const fieldOptionsSchema = z
  .object({
    triggerDefinedOptions: triggerDefinedOptionsSchema,
    selectionType: z.nativeEnum(OptionSelectionType).default(OptionSelectionType.Select),
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
    options: z.array(optionSchema).default([]),
    // array of resultConfig ids
    linkedResultOptions: z.array(z.object({ id: z.string().min(1) })).default([]),
  })
  .refine(
    (options) => {
      if (
        options.selectionType === OptionSelectionType.MultiSelect &&
        options.maxSelections === undefined
      )
        return false;
      return true;
    },
    { path: ["maxSelections"], message: "Required" },
  );

const baseFieldSchema = z.object({
  fieldId: z.string().uuid(),
  name: z.string().min(1),
  systemType: z.nativeEnum(SystemFieldType).nullable().optional(),
  required: z.boolean().optional().default(true),
  isInternal: z.boolean().default(false),
});

export const fieldSchema = z
  .discriminatedUnion("type", [
    baseFieldSchema.extend({
      type: z.literal(ValueType.String),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.Date),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.DateTime),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.Uri),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.Float),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.Entities),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.FlowVersion),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.Flows),
    }),
    baseFieldSchema.extend({
      type: z.literal(ValueType.OptionSelections),
      optionsConfig: fieldOptionsSchema,
    }),
  ])
  .refine(
    (field) => {
      if (
        field.type === ValueType.OptionSelections &&
        (field.optionsConfig.options ?? []).length === 0 &&
        !field.optionsConfig.triggerDefinedOptions?.hasTriggerDefinedOptions &&
        field.optionsConfig.linkedResultOptions.length === 0
      )
        return false;
      return true;
    },
    {
      // path: ["optionsConfig", "options"],
      message: "Add options or allow triggerer to create their own options.",
    },
  );

export const fieldsSchema = z.array(fieldSchema).default([]);

export const fieldSetSchema = z.object({
  fields: fieldsSchema,
  locked: z.boolean().default(false),
});
