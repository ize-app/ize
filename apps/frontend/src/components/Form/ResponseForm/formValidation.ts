import * as z from "zod";

import { fieldAnswerRecordSchema } from "../formValidation/field";

export type ResponseSchemaType = z.infer<typeof responseSchema>;

export const responseSchema = z.object({
  responseId: z.string().uuid(),
  responseFields: fieldAnswerRecordSchema.optional(),
});
