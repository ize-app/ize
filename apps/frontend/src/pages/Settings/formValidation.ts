import * as z from "zod";

export type UserSettingsSchemaType = z.infer<typeof userSettingsSchema>;

export const userSettingsSchema = z.object({
  userName: z.string().min(1, { message: "Please enter a name" }),
  notifications: z.object({
    transactional: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
});
