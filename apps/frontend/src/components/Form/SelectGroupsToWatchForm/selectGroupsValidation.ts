import * as z from "zod";

import { optionSelectionValuesSchema } from "../InputField/inputValidation";

export type GroupsToWatchSchemaType = z.infer<typeof groupsToWatchSchema>;
export const groupsToWatchSchema = z.object({
  groups: optionSelectionValuesSchema,
});
