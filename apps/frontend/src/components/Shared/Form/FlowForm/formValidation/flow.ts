import * as z from "zod";
import { agentFormSchema } from "../../ProcessForm/formSchema";
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
} from "../types";
import dayjs, { Dayjs } from "dayjs";
import { fieldsSchema, fieldSchema } from "./fields";

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
    threshold: z.object({
      decisionThresholdCount: z.coerce.number().int().positive(),
    }),
  }),
  z.object({
    type: z.literal(ResultDecisionType.PercentageVote),
    defaultOption: defaultOptionSchema.optional(),
    percentage: z.object({
      decisionThresholdPercentage: z.coerce.number().int().min(51).max(100),
    }),
  }),
]);

// export const resultSchema = z.discriminatedUnion("type",[z.object({})])

// TODO potentially reorganize this so it's more action oriented and less abstract
const stepSchema = z.object({
  // name: z.string().min(1), // maybe remove and
  // type: z.any(), // TODO buy maybe it's 1) decide 2) get feedback
  // resultType: z.any(), // TODO but maybes its 1) webhook and 2) trigger new process step
  type: z.nativeEnum(StepType).nullable(),
  request: z
    .object({
      // permission: z.object({
      //   type: z.nativeEnum(RequestPermissionType),
      //   agents: z
      //     .array(agentFormSchema)
      //     .min(1, "Please select at least one group or individual.")
      //     .optional(),
      //   // processId: z.string().uuid().optional(),
      // }),
      fields: fieldsSchema,
    })
    .optional(),
  response: z.object({
    // permission: z.object({
    //   type: z.nativeEnum(RespondPermissionType),
    //   agents: z
    //     .array(agentFormSchema)
    //     .min(1, "Please select at least one group or individual.")
    //     .optional(),
    // }),
    field: fieldSchema,
  }),
  // result: z.object({
  //   // type: z.nativeEnum(ResultType), // maybe delete
  //   requestExpirationSeconds: z.coerce.number(),
  //   minimumResponses: z.coerce.number().default(1),
  //   decision: decisionSchema.optional(),
  //   priority: z
  //     .object({
  //       onlyIncludeTopOptions: z.boolean().default(false),
  //       numOptionsToInclude: z.coerce.number().optional(),
  //     })
  //     .refine(
  //       (res) => {
  //         if (res.onlyIncludeTopOptions && !res.numOptionsToInclude) return false;
  //         return true;
  //       },
  //       { path: ["numOptionsToInclude"] },
  //     )
  //     .optional(),
  //   freeText: z
  //     .object({
  //       type: z.nativeEnum(ResultFreeText),
  //       aiSummary: z
  //         .object({
  //           prompt: z.string(),
  //         })
  //         .optional(),
  //     })
  //     .optional(),
  // }),
  // actions: z.object({
  //   type: z.nativeEnum(ActionType),
  //   filter: z
  //     .object({
  //       allOptions: z.boolean(),
  //       optionId: z.string().optional(),
  //     })
  //     .refine(
  //       (filter) => {
  //         if (!filter.allOptions && !filter.optionId) return false;
  //         return true;
  //       },
  //       { path: ["optionId"], message: "Select an option" },
  //     )
  //     .optional(),
  //   callWebhook: z
  //     .object({
  //       uri: z.string().url(),
  //       name: z.string().min(1),
  //     })
  //     .optional(),
  // }),
});

export const flowSchema = z.object({
  // name: z.string().min(1, "Enter a name"),
  // reusable: z.boolean().default(false).optional(),
  steps: z.array(stepSchema).min(1, "There must be at least 1 step"),
  // editStep: stepSchema, // TODO make this more specific to the edit step
});
