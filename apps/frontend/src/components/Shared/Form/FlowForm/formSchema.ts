import * as z from "zod";
import { agentFormSchema } from "../ProcessForm/formSchema";
import {
  FreeTextDataType,
  FreeTextResponseType,
  OptionsCreationType,
  RequestInputDataType,
  RequestTriggerType,
  RespondInputType,
  RespondTriggerType,
  ResultSingleOptionType,
  ResultSummaryType,
  ResultType,
  ActionType,
} from "./types";

const requestInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  required: z.boolean(),
  dataType: z.nativeEnum(RequestInputDataType),
});

// TODO - add option Id to this - for action and result
const optionSchema = z
  .array(z.string({ invalid_type_error: "Please only include text options" }).trim())
  .min(1, "Add at least 1 option")
  .optional();

// TODO potentially reorganize this so it's more action oriented and less abstract
const stepSchema = z.object({
  // name: z.string().min(1), // maybe remove and
  // type: z.any(), // TODO buy maybe it's 1) decide 2) get feedback
  // resultType: z.any(), // TODO but maybes its 1) webhook and 2) trigger new process step
  request: z.object({
    permission: z.object({
      type: z.nativeEnum(RequestTriggerType),
      agents: z
        .array(agentFormSchema)
        .min(1, "Please select at least one group or individual.")
        .optional(),
      // processId: z.string().uuid().optional(),
    }),
    inputs: z.array(requestInputSchema),
  }),
  // respond: z.object({
  //   permission: z.object({
  //     // add something here for "pass through"
  //     type: z.nativeEnum(RespondTriggerType),
  //     agents: z
  //       .array(agentFormSchema)
  //       .min(1, "Please select at least one group or individual.")
  //       .optional(),
  //   }),
  //   inputs: z.object({
  //     type: z.nativeEnum(RespondInputType),
  //     freeText: z.object({
  //       type: z.nativeEnum(FreeTextResponseType),
  //       dataType: z.nativeEnum(FreeTextDataType),
  //     }),
  //     selectOption: z.object({
  //       type: z.nativeEnum(OptionsCreationType),
  //       processDefinedOptions: optionSchema,
  //     }),
  //     rankedChoice: z.object({
  //       type: z.nativeEnum(OptionsCreationType),
  //       processDefinedOptions: optionSchema,
  //     }),
  //   }),
  // }),
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
