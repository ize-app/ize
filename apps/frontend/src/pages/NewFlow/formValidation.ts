import * as z from "zod";

import { actionSchema } from "@/components/Form/FlowForm/formValidation/action";
import { newFlowFormSchema } from "@/components/Form/FlowForm/formValidation/flow";
import { permissionSchema } from "@/components/Form/FlowForm/formValidation/permission";

export type NewFlowWizardFormSchema = z.infer<typeof newFlowWizardFormSchema>;

export type IntitialFlowSetupSchemaType = z.infer<typeof intitialFlowSetupSchema>;

export enum FlowGoal {
  TriggerWebhook = "TriggerWebhook",
  Decision = "Decision",
  Prioritize = "Prioritize",
  AiSummary = "AISummary",
}

export enum ActionTriggerCondition {
  None = "None",
  Decision = "Decision",
}

export enum OptionsType {
  Preset = "Preset",
  Trigger = "Trigger",
  PrevStep = "PrevStep",
}

const decisionSchema = z.object({
  name: z.string().min(1),
  // options: z.array(fieldOptionSchema).default([]),
  // optionsType: z.nativeEnum(OptionsType),
});

export const intitialFlowSetupSchema = z.discriminatedUnion("goal", [
  z.object({
    goal: z.literal(FlowGoal.TriggerWebhook),
    permission: permissionSchema,
    webhookTriggerCondition: z.nativeEnum(ActionTriggerCondition),
    webhook: actionSchema,
    decision: decisionSchema.optional(),
  }),
  z.object({ goal: z.literal(FlowGoal.Decision), decision: decisionSchema }),
  z.object({ goal: z.literal(FlowGoal.Prioritize) }),
  z.object({ goal: z.literal(FlowGoal.AiSummary) }),
]);

export const newFlowWizardFormSchema = newFlowFormSchema.extend({
  initialFlowSetup: intitialFlowSetupSchema,
});
