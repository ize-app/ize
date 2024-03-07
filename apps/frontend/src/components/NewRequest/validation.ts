import { FieldDataType } from "@/graphql/generated/graphql";
import * as z from "zod";
import { evaluateMultiTypeInput } from "../shared/Form/validation";

export type RequestFieldSchemaType = z.infer<typeof requestFieldsSchema>;
export type RequestDefinedOptionSchemaType = z.infer<typeof requestDefinedOptionSchema>;
export type RequestDefinedOptionsSchemaType = z.infer<typeof requestDefinedOptionsSchema>;
export type RequestSchemaType = z.infer<typeof requestSchema>;

export const optionSelectionsSchema = z.array(z.object({ optionId: z.string().min(1) }));

export const requestFieldsSchema = z.record(
  z.string().min(1),
  z
    .object({
      dataType: z.nativeEnum(FieldDataType).optional(),
      value: z.any(),
      optionSelections: optionSelectionsSchema.optional(),
      required: z.boolean().optional(),
    })
    .superRefine((field, ctx) => {
      if (!field?.required && !field.value) return;
      if (!field.dataType) return;
      evaluateMultiTypeInput(field.value, field.dataType, ["value"], ctx);
    })

);

export const requestDefinedOptionSchema = z
  .object({
    dataType: z.nativeEnum(FieldDataType),
    name: z.any(),
  })
  .superRefine((field, ctx) => {
    evaluateMultiTypeInput(field.name, field.dataType, ["name"], ctx);
  });

export const requestDefinedOptionsSchema = z.array(requestDefinedOptionSchema).optional();

export const requestSchema = z.object({
  requestFields: requestFieldsSchema.optional(),
  requestDefinedOptions: requestDefinedOptionsSchema.optional(),
});
