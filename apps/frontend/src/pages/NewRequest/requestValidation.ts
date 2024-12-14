import * as z from "zod";

import { inputRecordSchema, optionSchema } from "../../components/Form/InputField/inputValidation";

export type RequestDefinedOptionsRecordSchema = z.infer<typeof requestDefinedOptionsRecordSchema>;
export type RequestDefinedOptionsFieldSchemaType = z.infer<typeof requestDefinedOptionsFieldSchema>;
export type RequestSchemaType = z.infer<typeof requestSchema>;

export const requestDefinedOptionsFieldSchema = z.array(optionSchema);

export const requestDefinedOptionsRecordSchema = z.record(
  z.string().min(1),
  requestDefinedOptionsFieldSchema,
);

export const requestSchema = z
  .object({
    requestId: z.string().uuid(),
    name: z.string().min(5, "Please write a description of at least 5 characters"),
    requestFields: inputRecordSchema.optional(),
    requestDefinedOptions: requestDefinedOptionsRecordSchema,
    watch: z.boolean().default(false),
  })
  .refine(
    (req) => {
      if (!req.name) return false;
      else return true;
    },
    { message: "Required", path: ["name"] },
  );
