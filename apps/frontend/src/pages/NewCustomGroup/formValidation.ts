import * as z from "zod";

import { entityFormSchema } from "../../components/Form/formValidation/entity";

export type NewCustomGroupSchemaType = z.infer<typeof newCustomGroupFormSchema>;

export const newCustomGroupFormSchema = z.object({
  name: z.string().min(1, "Please enter a name for the group"),
  description: z.string().min(5, "Description must be at leat 5 characters").optional(),
  members: z.array(entityFormSchema).min(1, "Please select at least one group or individual."),
});
