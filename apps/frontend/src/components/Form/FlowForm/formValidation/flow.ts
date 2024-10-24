import * as z from "zod";

import { FieldType, ResultType } from "@/graphql/generated/graphql";

import { actionSchema } from "./action";
import { fieldSetSchema } from "./fields";
import { permissionSchema } from "./permission";
import { resultsSchema } from "./result";

export type FlowSchemaType = z.infer<typeof flowSchema>;
export type StepSchemaType = z.infer<typeof stepSchema>;
export type ReusableSchema = z.infer<typeof reusableSchema>;
export type FlowWithEvolveFlowSchemaType = z.infer<typeof flowWithEvolveFlowSchema>;

const stepSchema = z
  .object({
    fieldSet: fieldSetSchema,
    response: z
      .object({
        permission: permissionSchema,
        allowMultipleResponses: z.boolean().default(false),
        canBeManuallyEnded: z.boolean().default(false),
        expirationSeconds: z.coerce.number().int().positive(),
      })
      .optional(),
    result: resultsSchema,
    action: actionSchema.optional(),
  })
  // this superRefine isn't strictly necessary since the UI currently ties together fields and
  .superRefine((step, ctx) => {
    if (
      (!step.fieldSet.fields || !step.fieldSet.fields.find((f) => f.type === FieldType.Options)) &&
      step.result.length > 0
    ) {
      step.result.forEach((res, index) => {
        if (res.type === ResultType.Decision) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Add an option field in the response before you can use the decision type",
            path: ["results", index],
          });
        }
      });
    }
  })
  .refine(
    (step) => {
      if (step.response && step.fieldSet.fields.length === 0) return false;
      else return true;
    },
    {
      message: "Add a field to this collaboration step",
    },
  );

export const flowSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
  // evolve: evolveFlowSchema,
  fieldSet: fieldSetSchema,
  trigger: z.object({
    permission: permissionSchema,
  }),
  requestName: z.string().optional(),
});
// .superRefine((flow, ctx) => {});

export const reusableSchema = z.object({
  reusable: z.boolean(),
});

export const flowWithEvolveFlowSchema = z.object({
  reusable: z.boolean(),
  flow: flowSchema,
  evolve: flowSchema,
});

export const newFlowFormSchema = z.object({
  new: flowWithEvolveFlowSchema,
});
