import * as z from "zod";

import { inputRecordSchema, inputSchema } from "../../components/Form/formValidation/field";

export type RequestDefinedOptionsRecordSchema = z.infer<typeof requestDefinedOptionsRecordSchema>;
export type RequestDefinedOptionsFieldSchemaType = z.infer<typeof requestDefinedOptionsFieldSchema>;
export type RequestSchemaType = z.infer<typeof requestSchema>;

// export const requestDefinedOptionSchema = z
//   .object({
//     dataType: z.nativeEnum(FieldDataType),
//     name: z.any(),
//   })
//   .superRefine((field, ctx) => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//     evaluateMultiTypeInput(field.name, field.dataType, ["name"], ctx);
//   });

export const requestDefinedOptionsFieldSchema = z.array(inputSchema);

export const requestDefinedOptionsRecordSchema = z.record(
  z.string().min(1),
  requestDefinedOptionsFieldSchema,
);

export const requestSchema = z
  .object({
    requestId: z.string().uuid(),
    name: z.string().min(5, "Please make the request name at least 5 characters"),
    requestFields: inputRecordSchema.optional(),
    requestDefinedOptions: requestDefinedOptionsRecordSchema,
  })
  .refine(
    (req) => {
      if (!req.name) return false;
      else return true;
    },
    { message: "Required", path: ["name"] },
  );
