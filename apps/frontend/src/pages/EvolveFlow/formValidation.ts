import * as z from "zod";
import { flowSchema } from "@/components/Form/FlowForm/formValidation/flow";

export const evolveExistingFlowSchema = flowSchema.extend({
  currentFlow: flowSchema,
});

export type EvolveExistingFlowSchemaType = z.infer<typeof evolveExistingFlowSchema>;
