import * as z from "zod";

import { FieldType, ResultType } from "@/graphql/generated/graphql";

import { actionSchema } from "./action";
import { evolveFlowSchema } from "./evolve";
import { fieldsSchema } from "./fields";
import { permissionSchema } from "./permission";
import { resultsSchema } from "./result";

export type FlowSchemaType = z.infer<typeof flowSchema>;
export type StepSchemaType = z.infer<typeof stepSchema>;

const stepSchema = z
  .object({
    request: z
      .object({
        permission: permissionSchema,
        fields: fieldsSchema,
        fieldsLocked: z.boolean().default(false),
      })
      .optional(),
    response: z
      .object({
        permission: permissionSchema,
        fields: fieldsSchema,
        fieldsLocked: z.boolean().default(false),
      })
      .optional(),
    result: resultsSchema,
    action: actionSchema.optional(),
    allowMultipleResponses: z.boolean().default(false),
    expirationSeconds: z.coerce.number().int().positive().optional(),
  })
  .superRefine((step, ctx) => {
    if (
      (!step.response?.fields || !step.response.fields.find((f) => f.type === FieldType.Options)) &&
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
      if (step.response && step.response.fields.length === 0) return false;
      else return true;
    },
    {
      message: "Add a result to this collaboration step",
    },
  )
  .refine(
    (step) => {
      if (step.response && !step.expirationSeconds) return false;
      else return true;
    },
    {
      message: "Required",
      path: ["expirationSeconds"],
    },
  );

export const flowSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  // reusable: z.boolean().optional().default(false),
  steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
  evolve: evolveFlowSchema,
});

export const newFlowFormSchema = z.object({
  newFlow: flowSchema,
});
