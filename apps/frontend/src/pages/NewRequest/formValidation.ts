import { FieldDataType } from "@/graphql/generated/graphql";
import * as z from "zod";
import { evaluateMultiTypeInput } from "../../components/Form/formValidation/field";

import { fieldAnswerRecordSchema } from "../../components/Form/formValidation/field";

export type RequestDefinedOptionSchemaType = z.infer<typeof requestDefinedOptionSchema>;
export type RequestDefinedOptionsSchemaType = z.infer<typeof requestDefinedOptionsSchema>;
export type RequestSchemaType = z.infer<typeof requestSchema>;

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
  name: z.string().min(5, "Please make the request name at least 5 characters").optional(),
  requestFields: fieldAnswerRecordSchema.optional(),
  requestDefinedOptions: requestDefinedOptionsSchema.optional(),
});
