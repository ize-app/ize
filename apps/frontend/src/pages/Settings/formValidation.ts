import * as z from "zod";

export type UserSettingsSchemaType = z.infer<typeof userSettingsSchema>;

export const userSettingsSchema = z.object({
  userName: z.string().min(1),
});
