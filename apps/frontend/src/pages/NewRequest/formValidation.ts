import * as z from "zod";

import { FieldDataType } from "@/graphql/generated/graphql";

import {
  evaluateMultiTypeInput,
  fieldAnswerRecordSchema,
} from "../../components/Form/formValidation/field";

export type RequestDefinedOptionSchemaType = z.infer<typeof requestDefinedOptionSchema>;
export type RequestDefinedOptionsSchemaType = z.infer<typeof requestDefinedOptionsSchema>;
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

export const requestDefinedOptionsSchema = z.array(requestDefinedOptionSchema).optional();

export const requestSchema = z
  .object({
    // strangely, making this field required creates other errors so I made the field required via the refine method
    name: z.string().min(5, "Please make the request name at least 5 characters").optional(),
    requestFields: fieldAnswerRecordSchema.optional(),
    requestDefinedOptions: requestDefinedOptionsSchema.optional(),
  })
  .refine(
    (req) => {
      if (!req.name) return false;
      else return true;
    },
    { message: "Required", path: ["name"] },
  );
