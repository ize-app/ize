import { ZodErrorMap, setErrorMap, z } from "zod";

// import { fieldOptionSchema } from "@/components/Form/FlowForm/formValidation/fields";
import {
  fieldOptionSchema,
  triggerDefinedOptionsSchema,
} from "@/components/Form/FlowForm/formValidation/fields";
import { newFlowFormSchema } from "@/components/Form/FlowForm/formValidation/flow";
import { permissionSchema } from "@/components/Form/FlowForm/formValidation/permission";
import { decisionSchema } from "@/components/Form/FlowForm/formValidation/result";

export type NewFlowWizardFormSchema = z.infer<typeof newFlowWizardFormSchema>;

export type IntitialFlowSetupSchemaType = z.infer<typeof intitialFlowSetupSchema>;

// Define a custom error map function
const customErrorMap: ZodErrorMap = (issue, ctx) => {
  if (issue.code === "invalid_union_discriminator") {
    return { message: "Required" };
  }
  // Use the default error message for other error codes
  return { message: ctx.defaultError };
};

// Set the custom error map globally
setErrorMap(customErrorMap);

export enum FlowGoal {
  TriggerWebhook = "TriggerWebhook",
  Decision = "Decision",
  Prioritize = "Prioritize",
  GetPerspectives = "GetPerspectives",
}

export enum Reusable {
  Reusable = "Reusable",
  NotReusable = "NotReusable",
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

export enum PerspectiveResultType {
  Raw = "Raw",
  Ai = "Ai",
}

export enum AIOutputType {
  Summary = "Summary",
  List = "List",
}

const optionConfigSchema = z
  .object({
    options: z.array(fieldOptionSchema).default([]),
    triggerDefinedOptions: triggerDefinedOptionsSchema,
    linkedOptions: z.object({
      hasLinkedOptions: z.boolean().optional().default(false),
      question: z.string().optional(),
      useAi: z.boolean().optional(),
      prompt: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (
        data.options.length === 0 &&
        !data.triggerDefinedOptions?.dataType &&
        !data.linkedOptions.hasLinkedOptions
      ) {
        return false;
      }
      return true;
    },
    { message: "Define how participants will select options" },
  )
  .refine(
    (data) => {
      if (!!data.linkedOptions.hasLinkedOptions && !data.linkedOptions.question) {
        return false;
      }
      return true;
    },
    { message: "Add a question", path: ["linkedOptions", "question"] },
  )
  .refine(
    (data) => {
      if (!!data.linkedOptions.useAi && !data.linkedOptions.prompt) {
        return false;
      }
      return true;
    },
    { message: "Add a prompt for the AI", path: ["linkedOptions", "prompt"] },
  );

export const perspectiveResultSchema = z
  .object({
    type: z.nativeEnum(PerspectiveResultType),
    aiOutputType: z.nativeEnum(AIOutputType).optional(),
    prompt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === PerspectiveResultType.Ai && !data.aiOutputType) return false;
      return true;
    },
    { message: "Choose a type", path: ["aiOutputType"] },
  )
  .refine(
    (data) => {
      if (data.type === PerspectiveResultType.Ai && !data.prompt) return false;
      return true;
    },
    { message: "Write a prompt for the AI", path: ["prompt"] },
  );


export const intitialFlowSetupSchema = z.discriminatedUnion("goal", [
  z.object({
    goal: z.literal(FlowGoal.TriggerWebhook),
    reusable: z.nativeEnum(Reusable),
    permission: permissionSchema,
    webhookTriggerCondition: z.nativeEnum(ActionTriggerCondition),
    // webhook: actionSchema,
    webhookName: z.string(),
    optionsConfig: optionConfigSchema.optional(),
    filterOptionId: z.string().nullable().default(null),
  }),
  z.object({
    goal: z.literal(FlowGoal.Decision),
    reusable: z.nativeEnum(Reusable),
    permission: permissionSchema,
    optionsConfig: optionConfigSchema,
    question: z.string(),
    decision: decisionSchema,
  }),
  z.object({
    goal: z.literal(FlowGoal.Prioritize),
    reusable: z.nativeEnum(Reusable),
    question: z.string(),
    permission: permissionSchema,
    optionsConfig: optionConfigSchema,
  }),
  z.object({
    goal: z.literal(FlowGoal.GetPerspectives),
    reusable: z.nativeEnum(Reusable),
    permission: permissionSchema,
    question: z.string(),
    result: perspectiveResultSchema,
  }),
]);

export const newFlowWizardFormSchema = newFlowFormSchema.extend({
  initialFlowSetup: intitialFlowSetupSchema,
});
