import * as z from "zod";
import { Blockchain, NewAgentTypes, AgentType } from "@/graphql/generated/graphql";
import { ethers } from "ethers";

export type EntitySchemaType = z.infer<typeof entityFormSchema>;

const groupFormSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  name: z.string(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  memberCount: z.number().optional().nullable(),
  organization: z.object({
    name: z.string(),
    icon: z.string().optional().nullable(),
  }),
  __typename: z.nativeEnum(AgentType),
  groupType: z
    .object({
      __typename: z.any(),
    })
    .optional(),
});

const identityFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  entityId: z.string(),
  icon: z.string().optional().nullable(),
  __typename: z.nativeEnum(AgentType),
  identityType: z
    .object({
      __typename: z.any(),
    })
    .optional(),
});

export const entityFormSchema = z.union([identityFormSchema, groupFormSchema]);

export const newEntityFormSchema = z.object({
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
            .refine(
              (value) => {
                const isAddress = ethers.isAddress(value);
                const ensRegex =
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                const isEns = !!value.match(ensRegex);
                return isAddress || isEns;
              },
              {
                message: "Provided wallet is invalid. Please insure you have typed correctly.",
              },
            ),
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
