import * as z from "zod";
import { ActionNewType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "./fields";

export type ActionSchemaType = z.infer<typeof actionSchema>;

const callWebhookSchema = z.object({
  uri: z.string().url(),
  name: z.string().min(1),
});

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ActionNewType.TriggerStep),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
  }),
  z.object({
    type: z.literal(ActionNewType.CallWebhook),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
    callWebhook: callWebhookSchema,
  }),
  z.object({
    type: z.literal(ActionNewType.EvolveFlow),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
  }),
  z.object({
    type: z.literal(ActionNewType.None),
  }),
]);
