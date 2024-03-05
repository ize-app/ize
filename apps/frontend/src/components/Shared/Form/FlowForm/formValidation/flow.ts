import * as z from "zod";
import { fieldsSchema } from "./fields";
import { permissionSchema } from "./permission";
import { resultsSchema } from "./result";
import { actionSchema } from "./action";
import { evolveFlowSchema } from "./evolve";

export type FlowSchemaType = z.infer<typeof flowSchema>;
export type EvolveExistingFlowSchemaType = z.infer<typeof evolveExistingFlowSchema>;
export type StepSchemaType = z.infer<typeof stepSchema>;

const stepSchema = z.object({
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
