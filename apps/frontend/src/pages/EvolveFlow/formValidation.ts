import * as z from "zod";

import { flowSchema, newFlowFormSchema } from "@/components/Form/FlowForm/formValidation/flow";

export const evolveExistingFlowSchema = newFlowFormSchema.extend({
  currentFlow: flowSchema,
  requestName: z.string(),
  requestDescription: z.string().optional(),
});

export const evolveRequestContextSchema = z.object({
  requestName: z.string(),
  requestDescription: z.string().optional(),
});

export type EvolveExistingFlowSchemaType = z.infer<typeof evolveExistingFlowSchema>;
export type EvolveRequestContextSchemaType = z.infer<typeof evolveRequestContextSchema>;
