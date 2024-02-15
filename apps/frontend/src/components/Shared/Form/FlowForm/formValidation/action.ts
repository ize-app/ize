import * as z from "zod";
import { ActionNewType } from "@/graphql/generated/graphql";

export type ActionSchemaType = z.infer<typeof actionSchema>;

const callWebhookSchema = z.object({
  uri: z.string().url(),
  name: z.string().min(1),
});

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ActionNewType.TriggerStep),
    filterOptionId: z.string().nullable().optional(),
  }),
  z.object({
    type: z.literal(ActionNewType.CallWebhook),
    filterOptionId: z.string().nullable().optional(),
    callWebhook: callWebhookSchema,
  }),
  z.object({
    type: z.literal(ActionNewType.None),
  }),
]);
