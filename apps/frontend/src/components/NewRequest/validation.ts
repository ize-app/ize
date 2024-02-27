import { FieldDataType } from "@/graphql/generated/graphql";
import * as z from "zod";
import { evaluateMultiTypeInput } from "../shared/Form/validation";

export type RequestFieldSchemaType = z.infer<typeof requestFieldsSchema>;
export type RequestDefinedOptionsType = z.infer<typeof requestDefinedOptionsSchema>;

export const requestFieldsSchema = z.record(
  z.string().min(1),
  z
    .object({
      dataType: z.nativeEnum(FieldDataType),
      value: z.any(),
      required: z.boolean(),
    })
    .superRefine((field, ctx) => {
      evaluateMultiTypeInput(field.value, field.dataType, ["value"], ctx);
    }),
);

export const requestDefinedOptionsSchema = z.object({}).optional().nullable();
