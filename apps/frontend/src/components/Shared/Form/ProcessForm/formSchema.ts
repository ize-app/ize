import * as z from "zod";
import { webhookTriggerFilterOptions } from "./helpers/optionHelpers";
import {
  FormOptionChoice,
  DecisionType,
  HasCustomIntegration,
} from "@/components/shared/Form/ProcessForm/types";
import { InputDataType } from "@/graphql/generated/graphql";
import { AgentType } from "@/graphql/generated/graphql";

const webhookFormSchema = z.object({
  hasWebhook: z.string().nonempty(),
  uri: z.string().url("Please add a valid URL").optional(),
});

const actionFormSchema = z.object({
  optionTrigger: z.string().optional(),
  webhook: webhookFormSchema,
});

export const requestTemplateFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Please add a valid title")
      .max(140, "Please keep the name under 140 characters"),
    description: z.string().trim().nonempty("Please add a valid description"),

    options: z.string(),
    customOptions: z
      .array(
        z
          .string({ invalid_type_error: "Please only include text options" })
          .trim()
          .nonempty("Please only include text options"),
      )
      .min(1, "Add at least 1 option")
      .optional(),
    action: actionFormSchema,
  })
  .refine(
    (data) => {
      if (
        data.action.webhook.hasWebhook === HasCustomIntegration.Yes &&
        data.action.webhook.uri === ""
      )
        return false;
      return true;
    },
    { path: ["webookUri"] },
  )
  .refine(
    (data) => {
      if (
        data.options === FormOptionChoice.Custom &&
        data?.customOptions?.length === 0
      )
        return false;
      return true;
    },
    { path: ["customOptions"] },
  )
  .refine(
    (data) => {
      if (
        data.action.webhook.hasWebhook === HasCustomIntegration.Yes &&
        webhookTriggerFilterOptions({
          optionType: data.options,
          customOptions: data.customOptions ?? [],
        }).findIndex((option) => data.action.optionTrigger === option.value) ===
          -1
      )
        return false;

      return true;
    },
    {
      path: ["webhookTriggerFilter"],
      message:
        "Please select an one of your options to be the webhook trigger.",
    },
  );

const inputTemplateFormSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim(),
  required: z.boolean(),
  type: z.nativeEnum(InputDataType),
});

export const createInputTemplatesFormSchema = (fieldArrayName: string) =>
  z.object({ [fieldArrayName]: z.array(inputTemplateFormSchema) });

const organizationFormSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().optional().nullable(),
});

const userGroupFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(AgentType),
  avatarUrl: z.string().url().optional().nullable(),
  backgroundColor: z.string().optional().nullable(),
  parent: organizationFormSchema.optional().nullable(),
});

const absoluteDecisionFormSchema = z.object({
  threshold: z.number(),
});

const percentageDecisionFormSchema = z.object({
  percentage: z.number(),
  quorum: z.number(),
});

export const rolesFormSchema = z
  .object({
    rights: z.object({
      request: z
        .array(userGroupFormSchema)
        .min(1, "Please select at least one group or individual."),
      response: z
        .array(userGroupFormSchema)
        .min(1, "Please select at least one group or individual."),
    }),
    requestExpirationSeconds: z.number(),
    decision: z.object({
      type: z.nativeEnum(DecisionType),
      absoluteDecision: absoluteDecisionFormSchema.optional(),
      percentageDecision: percentageDecisionFormSchema.optional(),
    }),
  })
  .refine(
    (data) => {
      if (
        data.decision.type === DecisionType.Percentage &&
        data.decision?.percentageDecision?.quorum === undefined
      )
        return false;
      return true;
    },
    { path: ["decision.percentageDecision.quorum"] },
  );
