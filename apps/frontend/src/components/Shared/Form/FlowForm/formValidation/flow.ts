import * as z from "zod";
import { fieldsSchema } from "./fields";
import { permissionSchema } from "./permission";
import { resultsSchema } from "./result";
import { actionSchema } from "./action";
import { evolveFlowSchema } from "./evolve";
import { FieldType, ResultType } from "@/graphql/generated/graphql";

export type FlowSchemaType = z.infer<typeof flowSchema>;
export type EvolveExistingFlowSchemaType = z.infer<typeof evolveExistingFlowSchema>;
export type StepSchemaType = z.infer<typeof stepSchema>;

const stepSchema = z
  .object({
    request: z
      .object({
        permission: permissionSchema,
        fields: fieldsSchema,
      })
      .optional(),
    response: z
      .object({
        permission: permissionSchema,
        fields: fieldsSchema,
      })
      .optional(),
    results: resultsSchema,
    action: actionSchema,
    expirationSeconds: z.coerce.number().int().positive(),
    minimumResponses: z.coerce.number().int().positive(),
  })
  .superRefine((step, ctx) => {
    if (
      (!step.response?.fields || !step.response.fields.find((f) => f.type === FieldType.Options)) &&
      step.results.length > 0
    ) {
      step.results.forEach((res, index) => {
        if (res.type === ResultType.Decision) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Add an option field in the response before you can use the decision type",
            path: ["results", index],
          });
        }
      });
    }
  });

export const flowSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  reusable: z.boolean().optional().default(false),
  steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
  evolve: evolveFlowSchema.optional(),
});

export const evolveExistingFlowSchema = flowSchema.extend({
  currentFlow: flowSchema,
});
