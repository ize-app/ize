import * as z from "zod";

import { ActionType } from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "./fields";

export type ActionSchemaType = z.infer<typeof actionSchema>;

const callWebhookSchema = z
  .object({
    webhookId: z.string().min(1),
    uri: z.string().url(),
    name: z.string().min(1),
    // when existing webhook is change, we don't send the full uri to the FE for safety reasons
    // instead, we compare truncated "originalUri" with the new uri to determine if the webhook has changed
    originalUri: z.string().url().optional(),
    valid: z.boolean().optional(),
  })
  .refine(
    (webhook) => {
      if (!webhook.valid) {
        return false;
      } else return true;
    },
    { path: ["uri"], message: "Test this webhook successfully to continue" },
  );

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ActionType.TriggerStep),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
  }),
  z.object({
    type: z.literal(ActionType.CallWebhook),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    callWebhook: callWebhookSchema,
  }),
  z.object({
    type: z.literal(ActionType.EvolveFlow),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
  }),
  z.object({
    type: z.literal(ActionType.None),
  }),
]);
