import * as z from "zod";

import { FieldType, FlowType, ResultType } from "@/graphql/generated/graphql";

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
        minResponses: z.coerce.number().int().positive().default(1),
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
  // check if default option is valid
  .superRefine((step, ctx) => {
    step.result.forEach((res, index) => {
      if (res.type === ResultType.Decision && res.decision.defaultDecision?.optionId) {
        const defaultOptionId = res.decision.defaultDecision?.optionId;
        const field = step.fieldSet.fields.find((f) => f.fieldId === res.fieldId);

        const option =
          field &&
          field.type === FieldType.Options &&
          field.optionsConfig.options.find((o) => o.optionId === defaultOptionId);
        if (!option) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Default option must be a valid option",
            path: ["result", index, "decision", "defaultDecision", "optionId"],
          });
        }
      }
    });
  })
  .refine(
    (step) => {
      if (step.response && step.fieldSet.fields.length === 0) return false;
      else return true;
    },
    {
      message: "Add a result to this step",
    },
  );

export const flowSchema = z
  .object({
    type: z.nativeEnum(FlowType),
    name: z.string().min(1, "Enter a name"),
    steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
    // evolve: evolveFlowSchema,
    fieldSet: fieldSetSchema,
    trigger: z.object({
      permission: permissionSchema,
    }),
    requestName: z.string().optional(),
  })
  .refine(
    (flow) => {
      if (flow.steps.length === 1 && flow.steps[0].result.length === 0 && !flow.steps[0].action) {
        return false;
      } else return true;
    },
    { message: "There must be at least one collaborative step or action", path: ["steps"] },
  ) // check if linked result options are valid
  .superRefine((flow, ctx) => {
    flow.steps.forEach((step, stepIndex) => {
      step.fieldSet.fields.forEach((field, fieldIndex) => {
        if (
          field.type === FieldType.Options &&
          field.optionsConfig.linkedResultOptions.length > 0
        ) {
          console.log("evaluating linked result options", field.optionsConfig.linkedResultOptions);
          field.optionsConfig.linkedResultOptions.forEach(
            (linkedResultOption, linkedResultIndex) => {
              let hasMatch = false;
              for (const s of flow.steps) {
                if (s.result.find((r) => r.resultId === linkedResultOption.id)) {
                  hasMatch = true;
                  break;
                }
              }
              if (!hasMatch) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Linked result not found",
                  path: [
                    "steps",
                    stepIndex,
                    "fieldSet",
                    "fields",
                    fieldIndex,
                    "optionsConfig",
                    "linkedResultOptions",
                    linkedResultIndex,
                    "id",
                  ],
                });
              }
            },
          );
        }
      });
    });
  });

export const reusableSchema = z.object({
  reusable: z.boolean(),
});

export const flowWithEvolveFlowSchema = z.object({
  reusable: z.boolean(),
  flow: flowSchema,
  evolve: flowSchema.optional(),
});

export const newFlowFormSchema = z.object({
  new: flowWithEvolveFlowSchema,
});
