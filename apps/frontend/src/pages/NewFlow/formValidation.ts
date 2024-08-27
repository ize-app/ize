import * as z from "zod";

import { newFlowFormSchema } from "@/components/Form/FlowForm/formValidation/flow";
import { permissionSchema } from "@/components/Form/FlowForm/formValidation/permission";

export type NewFlowWizardFormSchema = z.infer<typeof newFlowWizardFormSchema>;

export type IntitialFlowSetupSchemaType = z.infer<typeof intitialFlowSetupSchema>;

export enum FlowGoal {
  TriggerAction = "TriggerAction",
  Decision = "Decision",
  Prioritize = "Prioritize",
  AiSummary = "AISummary",
}

export const intitialFlowSetupSchema = z.discriminatedUnion("goal", [
  z.object({ goal: z.literal(FlowGoal.TriggerAction), permission: permissionSchema }),
  z.object({ goal: z.literal(FlowGoal.Decision), permission: permissionSchema }),
  z.object({ goal: z.literal(FlowGoal.Prioritize), permission: permissionSchema }),
  z.object({ goal: z.literal(FlowGoal.AiSummary), permission: permissionSchema }),
]);

export const newFlowWizardFormSchema = newFlowFormSchema.extend({
  initialFlowSetup: intitialFlowSetupSchema,
});
