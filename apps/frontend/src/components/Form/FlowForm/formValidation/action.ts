import * as z from "zod";

import { ActionType } from "@/graphql/generated/graphql";

import { webhookSchema } from "../../formValidation/webhook";

export type ActionSchemaType = z.infer<typeof actionSchema>;
export type ActionFilterSchemaType = z.infer<typeof actionFilterSchema>;

const actionFilterSchema = z
  .object({
    resultConfigId: z
      .string({ errorMap: () => ({ message: "Choose a result to filter action by" }) })
      .uuid(),
    optionId: z
      .string({ errorMap: () => ({ message: "Choose an option to filter action by" }) })
      .uuid(),
  })
  .optional();

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ActionType.TriggerStep),
    filter: actionFilterSchema,
    stepId: z.string().uuid(),
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.CallWebhook),
    filter: actionFilterSchema,
    callWebhook: webhookSchema,
    locked: z.boolean().default(false),
  }),
  z.object({
    type: z.literal(ActionType.EvolveFlow),
    filter: actionFilterSchema,
    locked: z.boolean().default(true),
  }),
  z.object({
    type: z.literal(ActionType.EvolveGroup),
    filter: actionFilterSchema,
    locked: z.boolean().default(true),
  }),
  z.object({
    type: z.literal(ActionType.GroupWatchFlow),
    filter: actionFilterSchema,
    locked: z.boolean().default(true),
  }),
]);
