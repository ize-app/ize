import * as z from "zod";

import { webhookTriggerFilterOptions } from "./helpers/optionHelpers";

import {
  DecisionType,
  DefaultEvolveProcessOptions,
  FormOptionChoice,
  HasCustomIntegration,
} from "@/components/shared/Form/ProcessForm/types";
import { Blockchain, InputDataType, NewAgentTypes } from "@/graphql/generated/graphql";
import { ethers } from "ethers";

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
      if (data.options === FormOptionChoice.Custom && data?.customOptions?.length === 0)
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
        }).findIndex((option) => data.action.optionTrigger === option.value) === -1
      )
        return false;

      return true;
    },
    {
      path: ["webhookTriggerFilter"],
      message: "Please select an one of your options to be the webhook trigger.",
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

const groupFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  memberCount: z.number().optional().nullable(),
  organization: z.object({
    name: z.string(),
    icon: z.string().optional().nullable(),
  }),
  __typename: z.string(),
  groupType: z
    .object({
      __typename: z.any(),
    })
    .optional(),
});

const identityFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional().nullable(),
  __typename: z.string(),
  identityType: z
    .object({
      __typename: z.any(),
    })
    .optional(),
});

const agentFormSchema = z.union([identityFormSchema, groupFormSchema]);

export const newAgentFormSchema = z.object({
  type: z.nativeEnum(NewAgentTypes),
  discordRole: z
    .object({
      serverId: z.string().trim().min(1, { message: "Select a server" }),
      roleId: z.string().trim().min(1, { message: "Select a role" }),
    })
    .optional(),
  ethAddress: z
    .string()
    .trim()
    .transform<string[]>((str, ctx) => {
      const parsed = z
        .array(
          z
            .string()
            .trim()
            .refine((value) => ethers.isAddress(value), {
              message: "Provided address is invalid. Please insure you have typed correctly.",
            }),
        )
        .safeParse(str.split(","));
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: parsed.error.issues[0].message,
        });
        return z.NEVER;
      } else {
        return parsed.data;
      }
    })
    .optional(),
  emailAddress: z
    .string()
    .trim()
    .transform<string[]>((str, ctx) => {
      try {
        const parsed = z.array(z.string().trim().email()).parse(str.split(","));
        return parsed;
      } catch (e) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid email(s)" });
        return [];
      }
    })
    .optional(),
  hat: z
    .object({
      chain: z.nativeEnum(Blockchain),
      tokenId: z.string(),
    })
    .optional(),
  nft: z
    .object({
      chain: z.nativeEnum(Blockchain),
      contractAddress: z.string().refine((value) => ethers.isAddress(value), {
        message: "Provided address is invalid. Please insure you have typed correctly.",
      }),
      allTokens: z.boolean(),
      tokenId: z.string().max(64).nullable().optional(),
    })
    .refine(
      (data) => {
        if (!data?.allTokens && !data?.tokenId) return false;
        else return true;
      },
      {
        message: "Missing token Id",
        path: ["tokenId"],
      },
    )
    .optional(),
});

const absoluteDecisionFormSchema = z.object({
  threshold: z.coerce.number(),
});

const percentageDecisionFormSchema = z.object({
  percentage: z.coerce.number(),
  quorum: z.coerce.number(),
});

const decisionFormSchemaUnrefined = z.object({
  rights: z.object({
    request: z.array(agentFormSchema).min(1, "Please select at least one group or individual."),
    response: z.array(agentFormSchema).min(1, "Please select at least one group or individual."),
  }),
  decision: z.object({
    type: z.nativeEnum(DecisionType),
    requestExpirationSeconds: z.number(),
    absoluteDecision: absoluteDecisionFormSchema.optional(),
    percentageDecision: percentageDecisionFormSchema.optional(),
  }),
});

const refineExtendedSharedSchema = (schema: typeof decisionFormSchemaUnrefined) =>
  schema
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
    )
    .refine(
      (data) => {
        if (
          data.decision.type === DecisionType.Percentage &&
          !!data.decision?.percentageDecision &&
          (data.decision?.percentageDecision?.percentage < 51 ||
            data.decision?.percentageDecision?.percentage > 100)
        )
          return false;
        return true;
      },
      {
        path: ["decision.percentageDecision.percentage"],
        message: "Please enter a value between 50% and 100%",
      },
    );

export const rolesFormSchema = refineExtendedSharedSchema(decisionFormSchemaUnrefined);

export const evolveProcessFormSchema = z.object({
  evolve: decisionFormSchemaUnrefined.extend({
    evolveDefaults: z.nativeEnum(DefaultEvolveProcessOptions),
  }),
});
