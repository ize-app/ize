import * as z from "zod";

import { newFlowFormSchema } from "@/components/Form/FlowForm/formValidation/flow";

export type NewFlowWizardFormSchema = z.infer<typeof newFlowWizardFormSchema>;

export const newFlowWizardFormSchema = newFlowFormSchema.extend({});
