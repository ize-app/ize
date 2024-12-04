import { z } from "zod";

import { ValueType } from "@/graphql/generated/resolver-types";

export type ValueSchemaType = z.infer<typeof valueSchema>;

export type FlowsValueSchemaType = z.infer<typeof flowsValueSchema>;
export type OptionSelectionsValueSchemaType = z.infer<typeof optionSelectionsValueSchema>;
export type EntitiesValueSchemaType = z.infer<typeof entitiesValueSchema>;
export type FlowVersionValueSchemaType = z.infer<typeof flowVersionValueSchema>;
export type StringValueSchemaType = z.infer<typeof stringValueSchema>;
export type FloatValueSchemaType = z.infer<typeof floatValueSchema>;
export type UriValueSchemaType = z.infer<typeof uriValueSchema>;
export type DateValueSchemaType = z.infer<typeof dateValueSchema>;
export type DateTimeValueSchemaType = z.infer<typeof dateTimeValueSchema>;

const flowsValueSchema = z.array(z.string().uuid());
const optionSelectionsValueSchema = z.array(
  z.object({ optionId: z.string().uuid(), weight: z.number().int() }),
);
const entitiesValueSchema = z.array(z.string().uuid());
const flowVersionValueSchema = z.string().uuid();
const stringValueSchema = z.string().min(1);
const floatValueSchema = z.number();
const uriValueSchema = z.string().url();
const dateValueSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/,
    "Invalid ISO-8601 date format (expected YYYY-MM-DDT00:00:00.000Z)",
  );
const dateTimeValueSchema = z.string().refine((value) => !isNaN(Date.parse(value)), {
  message: "Invalid DateTime format",
});

export const valueSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ValueType.Flows),
    value: flowsValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.OptionSelections),
    value: optionSelectionsValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.Entities),
    value: entitiesValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.FlowVersion),
    value: flowVersionValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.String),
    value: stringValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.Float),
    value: floatValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.Uri),
    value: uriValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.Date),
    value: dateValueSchema,
  }),
  z.object({
    type: z.literal(ValueType.DateTime),
    value: dateTimeValueSchema,
  }),
]);
