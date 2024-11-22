import * as z from "zod";

import { FieldDataType } from "@/graphql/generated/graphql";

import {
  evaluateMultiTypeInput,
  fieldAnswerRecordSchema,
} from "../../components/Form/formValidation/field";

export type RequestDefinedOptionSchemaType = z.infer<typeof requestDefinedOptionSchema>;
export type RequestDefinedOptionsFieldSchemaType = z.infer<typeof requestDefinedOptionsFieldSchema>;
export type RequestSchemaType = z.infer<typeof requestSchema>;

export const requestDefinedOptionSchema = z
  .object({
    dataType: z.nativeEnum(FieldDataType),
    name: z.any(),
  })
  .superRefine((field, ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    evaluateMultiTypeInput(field.name, field.dataType, ["name"], ctx);
  });

export const requestDefinedOptionsFieldSchema = z.array(requestDefinedOptionSchema);

export const requestDefinedOptionsSchema = z.record(
  z.string().min(1),
  requestDefinedOptionsFieldSchema,
);

export const requestSchema = z
  .object({
    requestId: z.string().uuid(),
    name: z.string().min(5, "Please make the request name at least 5 characters"),
    requestFields: fieldAnswerRecordSchema.optional(),
    requestDefinedOptions: requestDefinedOptionsSchema,
  })
  .refine(
    (req) => {
      if (!req.name) return false;
      else return true;
    },
    { message: "Required", path: ["name"] },
  );
