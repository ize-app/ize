import * as z from "zod";

import { ActionType } from "@/graphql/generated/graphql";

import { DefaultOptionSelection } from "./fields";
import { webhookSchema } from "../../formValidation/webhook";

export type ActionSchemaType = z.infer<typeof actionSchema>;

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ActionType.TriggerStep),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.CallWebhook),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    callWebhook: webhookSchema,
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.EvolveFlow),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(true),
  }),
  z.object({
    type: z.literal(ActionType.EvolveGroup),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(true),
  }),
  z.object({
    type: z.literal(ActionType.GroupWatchFlow),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    locked: z.boolean().default(true),
  }),
  z.object({
    type: z.literal(ActionType.None),
    locked: z.boolean().default(false),
  }),
]);
