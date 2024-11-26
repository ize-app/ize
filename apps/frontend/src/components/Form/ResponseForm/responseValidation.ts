import * as z from "zod";

import { inputRecordSchema } from "../InputField/inputValidation";

export type ResponseSchemaType = z.infer<typeof responseSchema>;

export const responseSchema = z.object({
  responseId: z.string().uuid(),
  responseFields: inputRecordSchema.optional(),
});
