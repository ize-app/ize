import * as z from "zod";
import { entityFormSchema } from "../shared/Form/FlowForm/formValidation/entity";

export type NewCustomGroupSchemaType = z.infer<typeof newCustomGroupFormSchema>;

export const newCustomGroupFormSchema = z.object({
  name: z.string().min(1, "Please enter a name for the group"),
  members: z.array(entityFormSchema).min(1, "Please select at least one group or individual."),
});
