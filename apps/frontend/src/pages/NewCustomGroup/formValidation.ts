import * as z from "zod";

import { decisionSchema } from "@/components/Form/FlowForm/formValidation/result";
import { webhookSchema } from "@/components/Form/formValidation/webhook";
import { GroupFlowPolicyType } from "@/graphql/generated/graphql";

import { entityFormSchema } from "../../components/Form/formValidation/entity";

export type GroupInitialSetupSchemaType = z.infer<typeof groupInitialSetupFormSchema>;
export type GroupSetupAndPoliciesSchemaType = z.infer<typeof groupSetupAndPoliciesFormSchema>;

export const groupInitialSetupFormSchema = z.object({
  name: z.string().min(1, "Please enter a name for the group"),
  description: z.string().optional(),
  members: z.array(entityFormSchema).min(1, "Please select at least one group or individual."),
  notification: webhookSchema,
});

export const groupFlowPolicy = z.object({
  type: z.nativeEnum(GroupFlowPolicyType),
  decision: decisionSchema.optional(),
});
// .refine((value) => {}, { message: "Please select a policy", path: ["decision"] });

export const groupSetupAndPoliciesFormSchema = groupInitialSetupFormSchema.extend({
  flows: z.object({
    evolveGroup: groupFlowPolicy,
    watch: groupFlowPolicy,
  }),
});
