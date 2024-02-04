import * as z from "zod";
import { agentFormSchema } from "../ProcessForm/formSchema";
import {
  OptionsCreationType,
  InputDataType,
  RequestPermissionType,
  RespondInputType,
  RespondPermissionType,
  ResultSingleOptionType,
  ResultSummaryType,
  ResultType,
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
  name: z.any(),
  required: z.boolean(),
  dataType: z.nativeEnum(InputDataType),
});

export const responseOptionSchema = z.object({
  name: z.any(),
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
      return;
    case InputDataType.Number:
      if (!z.coerce.number().safeParse(value).success)
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

// TODO potentially reorganize this so it's more action oriented and less abstract
const stepSchema = z.object({
  // name: z.string().min(1), // maybe remove and
  // type: z.any(), // TODO buy maybe it's 1) decide 2) get feedback
  // resultType: z.any(), // TODO but maybes its 1) webhook and 2) trigger new process step
  request: z.object({
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
  }),
  respond: z.object({
    permission: z.object({
      type: z.nativeEnum(RespondPermissionType),
      agents: z
        .array(agentFormSchema)
        .min(1, "Please select at least one group or individual.")
        .optional(),
    }),
    inputs: z.object({
      type: z.nativeEnum(RespondInputType).nullable(),
      freeInput: z
        .object({
          // type: z.nativeEnum(FreeInputResponseType),
          dataType: z.nativeEnum(InputDataType).optional(),
        })
        .optional(),
      options: z
        .object({
          creationType: z.nativeEnum(OptionsCreationType).optional(),
          dataType: z.nativeEnum(InputDataType).optional(),
          options: z.array(responseOptionSchema).optional(),
        })
        .superRefine((val, ctx) => {
          (val.options ?? []).forEach((option, index) => {
            evaluateMultiTypeInput(
              option.name,
              val.dataType as InputDataType,
              ["options", index.toString(), "name"],
              ctx,
            );
          });
        })
        .optional(),
    }),
  }),
  // result: z.object({
  //   type: z.nativeEnum(ResultType),
  //   requestExpirationSeconds: z.number(),
  //   minimumResponses: z.number(),
  //   rawResponses: z.object({}),
  //   singleOption: z.object({
  //     type: z.nativeEnum(ResultSingleOptionType),
  //     percentageVote: z.object({ percentage: z.coerce.number() }),
  //     thresholdVote: z.object({ threshold: z.coerce.number() }),
  //     optimisticVote: z.object({ threshold: z.coerce.number(), defaultOptionId: z.string() }),
  //     // rankChoiceVote: z.object({}), // might not be anything to do here
  //   }),
  //   summary: z.object({
  //     type: z.nativeEnum(ResultSummaryType),
  //     aiTextSummary: z.object({
  //       prompt: z.string(),
  //     }),
  //     weightedRanking: z.object({}),
  //     average: z.object({}),
  //     sum: z.object({}),
  //   }),
  // }),
  // action: z.object({
  //   type: z.nativeEnum(ActionType),
  //   filter: z.object({
  //     allOptions: z.boolean(),
  //     optionId: z.string(),
  //   }),
  //   triggerProcess: z.object({
  //     processId: z.string(),
  //   }),
  //   callWebhook: z.object({
  //     uri: z.string().url(),
  //     name: z.string().min(1),
  //   }),
  // }),
});

export const flowSchema = z.object({
  name: z.string().min(1, "Enter a name"),

  // reusable: z.boolean(),
  steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
  // editStep: stepSchema, // TODO make this more specific to the edit step
});
