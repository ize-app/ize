import * as z from "zod";

import { fieldAnswerSchema } from "../formValidation/field";

export type ResponseSchemaType = z.infer<typeof responseSchema>;

export const responseSchema = z.object({
  responseFields: fieldAnswerSchema.optional(),
});
