import * as z from "zod";

import {
  FieldDataType,
  FieldType,
  OptionSelectionType,
  SystemFieldType,
} from "@/graphql/generated/graphql";

import { evaluateMultiTypeInput } from "../../formValidation/field";

export type FieldOptionSchemaType = z.infer<typeof fieldOptionSchema>;
export type FieldOptionsSchemaType = z.infer<typeof fieldOptionsSchema>;
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
    dataType: z.nativeEnum(FieldDataType).nullable().optional(),
  })
  .refine(
    (options) => {
      if (options.hasTriggerDefinedOptions && !options.dataType) return false;
      return true;
    },
    {
      message: "Select a data type for the trigger defined options.",
      path: ["hasTriggerDefinedOptions"],
    },
  )
  .optional();

export const fieldOptionSchema = z
  .object({
    optionId: z.string(),
    name: z.any(),
    dataType: z.nativeEnum(FieldDataType),
  })
  .superRefine((option, ctx) => {
    evaluateMultiTypeInput(option.name as string, option.dataType, ["name"], ctx);
  });
// .transform((option) => ({
//   ...option,
//   name: option.name.toString(),
// }));

const fieldOptionsSchema = z
  .object({
    previousStepOptions: z.boolean().default(false),
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
    options: z.array(fieldOptionSchema).default([]),
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

export const fieldSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(FieldType.FreeInput),
      fieldId: z.string(),
      name: z.string().min(1),
      systemType: z.nativeEnum(SystemFieldType).nullable().optional(),
      required: z.boolean().optional().default(true),
      isInternal: z.boolean().default(false),
      freeInputDataType: z.nativeEnum(FieldDataType),
    }),
    z.object({
      type: z.literal(FieldType.Options),
      fieldId: z.string(),
      name: z.string().min(1),
      systemType: z.nativeEnum(SystemFieldType).nullable().optional(),
      required: z.boolean().optional().default(true),
      isInternal: z.boolean().default(false),
      optionsConfig: fieldOptionsSchema,
    }),
  ])
  .refine(
    (field) => {
      if (
        field.type === FieldType.Options &&
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
