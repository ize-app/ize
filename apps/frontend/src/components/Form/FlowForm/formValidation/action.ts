import * as z from "zod";

import { ActionType } from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "./fields";

export type ActionSchemaType = z.infer<typeof actionSchema>;

export const callWebhookSchema = z
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
    { path: ["uri"], message: "Test this webhook successfully to continue" },
  )
  .refine(
    (webhook) => {
      if (webhook.name && !webhook.uri) return false;
      else return true;
    },
    { path: ["uri"], message: "Please enter a valid URL" },
  );

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ActionType.TriggerStep),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.CallWebhook),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    callWebhook: callWebhookSchema,
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.EvolveFlow),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.GroupUpdateMembership),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.GroupUpdateMetadata),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.GroupWatchFlow),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(false),
  }),

  z.object({
    type: z.literal(ActionType.None),
    locked: z.boolean().default(false),
  }),
]);
