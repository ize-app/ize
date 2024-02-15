import * as z from "zod";
import { fieldsSchema, fieldSchema } from "./fields";
import { permissionSchema } from "./permission";
import { resultSchema } from "./result";
import { actionSchema } from "./action";
import { ResultType } from "@/graphql/generated/graphql";
import { evolveFlowSchema } from "./evolve";

export type FlowSchemaType = z.infer<typeof flowSchema>;
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
        field: fieldSchema,
      })
      .optional(),
    result: resultSchema,
    action: actionSchema,
  })
  .refine(
    (step) => {
      if (step.result.type !== ResultType.AutoApprove && !step.response) return false;
      else return true;
    },
    { message: "Missing request", path: ["request"] },
  );

export const flowSchema = z
  .object({
    name: z.string().min(1, "Enter a name"),
    reusable: z.boolean().default(false).optional(),
    steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
    evolve: evolveFlowSchema.optional(),
  })
  .superRefine((flow, ctx) => {
    flow.steps.map((step, index) => {
      if (!step.request && flow.reusable) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Missing reuqest field",
          path: ["steps", index],
        });
      }
    });
  });
