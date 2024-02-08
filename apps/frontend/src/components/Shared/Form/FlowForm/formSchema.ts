import * as z from "zod";
import { agentFormSchema } from "../ProcessForm/formSchema";
import {
  OptionsCreationType,
  InputDataType,
  RequestPermissionType,
  StepType,
  RespondPermissionType,
  ResultDecisionType,
  OptionSelectionType,
  ResultFreeText,
  ActionType,
} from "./types";
import dayjs, { Dayjs } from "dayjs";

const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");

export const requestInputSchema = z.object({
  inputId: z.string(),
  name: z.any(),
  required: z.boolean(),
  dataType: z.nativeEnum(InputDataType),
});

export const responseOptionSchema = z
  .object({
    optionId: z.string(),
    name: z.any(),
    dataType: z.nativeEnum(InputDataType),
  })
  .superRefine((option, ctx) => {
    evaluateMultiTypeInput(option.name, option.dataType as InputDataType, ["name"], ctx);
  });

const evaluateMultiTypeInput = (
  value: string,
  type: InputDataType,
  errorPath: (string | number)[],
  ctx: z.RefinementCtx,
) => {
  switch (type) {
    case InputDataType.Uri:
      if (!z.string().url().safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid Url",
          path: errorPath,
        });
      return;
    case InputDataType.String:
      if (!z.string().min(1).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid text",
          path: errorPath,
        });
      return;
    case InputDataType.Number:
      console.log();
      if (!z.number().or(z.string().min(1)).pipe(z.coerce.number()).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid number",
          path: errorPath,
        });
      return;
    case InputDataType.Date:
      if (!zodDay.safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date",
          path: errorPath,
        });
      return;
    case InputDataType.DateTime:
      if (!zodDay.safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid datetime",
          path: errorPath,
        });
      return;
    default:
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Unknown option",
        path: errorPath,
      });
      return;
  }
};

const defaultOptionSchema = z
  .object({
    hasDefault: z.boolean().default(false),
    optionId: z.string().optional(),
  })
  .refine(
    (defaultConfig) => {
      if (defaultConfig.hasDefault && !defaultConfig.optionId) return false;
      return true;
    },
    { path: ["optionId"], message: "Add a default option" },
  );

const decisionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ResultDecisionType.ThresholdVote),
    defaultOption: defaultOptionSchema.optional(),
    threshold: z
      .object({
        decisionThresholdCount: z.coerce.number().int().positive(),
      })
  }),
  z.object({
    type: z.literal(ResultDecisionType.PercentageVote),
    defaultOption: defaultOptionSchema.optional(),
    percentage: z.object({
      decisionThresholdPercentage: z.coerce.number().int().min(51).max(100),
    }),
  }),
]);

const responseOptionsSchema = z
  .object({
    previousStepOptions: z.boolean().optional(),
    requestOptions: z
      .object({
        requestCanCreateOptions: z.boolean().default(false).optional(),
        dataType: z.nativeEnum(InputDataType).optional(), // refers only to request created options
      })
      .refine(
        (requestOptions) => {
          if (requestOptions.requestCanCreateOptions && !requestOptions.dataType) {
            return false;
          }
          return true;
        },
        { path: ["dataType"], message: "Select a data type" },
      )
      .optional(),
    selectionType: z.nativeEnum(OptionSelectionType),
    maxSelectableOptions: z.coerce.number().optional(),
    stepOptions: z.array(responseOptionSchema).optional(),
  })
  .refine(
    (options) => {
      if (
        options.selectionType === OptionSelectionType.MultiSelect &&
        !options.maxSelectableOptions
      )
        return false;
      return true;
    },
    { path: ["maxSelectableOptions"], message: "Required" },
  );

export const respondInputsSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(StepType.GetInput),
      freeInput: z.object({
        dataType: z.nativeEnum(InputDataType),
      }),
    }),
    z.object({
      type: z.literal(StepType.Decide),
      options: responseOptionsSchema,
    }),
    z.object({
      type: z.literal(StepType.Prioritize),
      options: responseOptionsSchema,
    }),
  ])
  .refine(
    (inputs) => {
      if (
        (inputs.type === StepType.Prioritize || inputs.type === StepType.Decide) &&
        (inputs.options.stepOptions ?? []).length === 0 &&
        inputs.options.requestOptions?.requestCanCreateOptions &&
        inputs.options.previousStepOptions
      )
        return false;
      return true;
    },
    { path: [""], message: "Add options" },
  );

// export const resultSchema = z.discriminatedUnion("type",[z.object({})])

// TODO potentially reorganize this so it's more action oriented and less abstract
const stepSchema = z.object({
  name: z.string().min(1), // maybe remove and
  // type: z.any(), // TODO buy maybe it's 1) decide 2) get feedback
  // resultType: z.any(), // TODO but maybes its 1) webhook and 2) trigger new process step
  // type: z.nativeEnum(StepType).nullable(),
  request: z
    .object({
      permission: z.object({
        type: z.nativeEnum(RequestPermissionType),
        agents: z
          .array(agentFormSchema)
          .min(1, "Please select at least one group or individual.")
          .optional(),
        // processId: z.string().uuid().optional(),
      }),
      inputs: z
        .array(requestInputSchema)
        .superRefine((val, ctx) => {
          (val ?? []).forEach((input, index) => {
            evaluateMultiTypeInput(
              input.name,
              input.dataType as InputDataType,
              [index.toString(), "name"],
              ctx,
            );
          });
        })
        .optional(),
    })
    .optional(),
  respond: z.object({
    permission: z.object({
      type: z.nativeEnum(RespondPermissionType),
      agents: z
        .array(agentFormSchema)
        .min(1, "Please select at least one group or individual.")
        .optional(),
    }),
    inputs: respondInputsSchema,
  }),
  result: z.object({
    // type: z.nativeEnum(ResultType), // maybe delete
    requestExpirationSeconds: z.coerce.number(),
    minimumResponses: z.coerce.number().default(1),
    decision: decisionSchema.optional(),
    priority: z
      .object({
        onlyIncludeTopOptions: z.boolean().default(false),
        numOptionsToInclude: z.coerce.number().optional(),
      })
      .refine(
        (res) => {
          if (res.onlyIncludeTopOptions && !res.numOptionsToInclude) return false;
          return true;
        },
        { path: ["numOptionsToInclude"] },
      )
      .optional(),
    freeText: z
      .object({
        type: z.nativeEnum(ResultFreeText),
        aiSummary: z
          .object({
            prompt: z.string(),
          })
          .optional(),
      })
      .optional(),
  }),
  actions: z.object({
    type: z.nativeEnum(ActionType),
    filter: z
      .object({
        allOptions: z.boolean(),
        optionId: z.string().optional(),
      })
      .refine(
        (filter) => {
          if (!filter.allOptions && !filter.optionId) return false;
          return true;
        },
        { path: ["optionId"], message: "Select an option" },
      )
      .optional(),
    // triggerProcess: z
    //   .object({
    //     processId: z.string(),
    //   })
    //   .optional(),
    callWebhook: z
      .object({
        uri: z.string().url(),
        name: z.string().min(1),
      })
      .optional(),
  }),
});

export const flowSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  reusable: z.boolean().default(false).optional(),
  steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
  // editStep: stepSchema, // TODO make this more specific to the edit step
});
// .superRefine((flow, ctx) => {
//   if (flow.reusable) {
//     flow.steps.map((step, index) => {
//       if (!step.request) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.invalid_string,
//           validation: "url",
//           message: "Invalid Url",
//           path: ["steps", index.request.],
//         });
//       }
//     });
//   }

//   return true;
// });
