import * as z from "zod";

import { actionSchema } from "@/components/Form/FlowForm/formValidation/action";
// import { fieldOptionSchema } from "@/components/Form/FlowForm/formValidation/fields";
import {
  DefaultOptionSelection,
  fieldOptionSchema,
} from "@/components/Form/FlowForm/formValidation/fields";
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
export enum AIOutputType {
  Summary = "Summary",
  List = "List",
}

const optionConfigSchema = z
  .object({
    options: z.array(fieldOptionSchema).default([]),
    requestCreatedOptions: z.boolean().optional().default(false),
    linkedOptions: z.object({
      hasLinkedOptions: z.boolean().optional().default(false),
      question: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (
        data.options.length === 0 &&
        !data.requestCreatedOptions &&
        !data.linkedOptions.hasLinkedOptions
      ) {
        return false;
      }
      return true;
    },
    { message: "Define how participants will select options" },
  );

export const intitialFlowSetupSchema = z.discriminatedUnion("goal", [
  z.object({
    goal: z.literal(FlowGoal.TriggerWebhook),
    permission: permissionSchema,
    webhookTriggerCondition: z.nativeEnum(ActionTriggerCondition),
    webhook: actionSchema,
    optionsConfig: optionConfigSchema.optional(),
    filterOptionId: z.string().nullable().default(DefaultOptionSelection.None),
  }),
  z.object({
    goal: z.literal(FlowGoal.Decision),
    permission: permissionSchema,
    optionsConfig: optionConfigSchema,
    question: z.string(),
  }),
  z.object({
    goal: z.literal(FlowGoal.Prioritize),
    question: z.string(),
    permission: permissionSchema,
    optionsConfig: optionConfigSchema,
  }),
  z.object({
    goal: z.literal(FlowGoal.AiSummary),
    permission: permissionSchema,
    aiOutputType: z.nativeEnum(AIOutputType),
    question: z.string(),
    prompt: z.string(),
    example: z.string(),
  }),
]);

export const newFlowWizardFormSchema = newFlowFormSchema.extend({
  initialFlowSetup: intitialFlowSetupSchema,
});
