import * as z from "zod";

export type WebhookSchemaType = z.infer<typeof webhookSchema>;

export const webhookSchema = z
  .object({
    webhookId: z.string().min(1).default("defaultWebhookId"),
    uri: z.string().url().optional(),
    name: z.string().min(1).optional(),
    // when existing webhook is change, we don't send the full uri to the FE for safety reasons
    // instead, we compare truncated "originalUri" with the new uri to determine if the webhook has changed
    originalUri: z.string().url().optional(),
    valid: z.boolean().optional(),
  })
  .refine(
    (webhook) => {
      if (webhook.uri && !webhook.valid) {
        return false;
      } else return true;
    },
    { message: "Test this webhook successfully to continue" },
  )
  .refine(
    (webhook) => {
      if (webhook.name && !webhook.uri) return false;
      else return true;
    },
    { message: "Please enter a valid URL" },
  );
