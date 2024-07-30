import * as z from "zod";

import { callWebhookSchema } from "@/components/Form/FlowForm/formValidation/action";

import { entityFormSchema } from "../../components/Form/formValidation/entity";

export type NewCustomGroupSchemaType = z.infer<typeof newCustomGroupFormSchema>;

export const newCustomGroupFormSchema = z.object({
  name: z.string().min(1, "Please enter a name for the group"),
  description: z.string().optional(),
  members: z.array(entityFormSchema).min(1, "Please select at least one group or individual."),
  notification: callWebhookSchema,
});
