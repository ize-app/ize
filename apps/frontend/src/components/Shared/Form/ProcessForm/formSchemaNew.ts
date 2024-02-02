import * as z from "zod";
import { agentFormSchema } from "./formSchema";
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
} from "./typesNew";

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

const processSchema = z.object({
  name: z.string().min(1),
  requestPermission: z.object({
    type: z.nativeEnum(RequestTriggerType),
    agents: z
      .array(agentFormSchema)
      .min(1, "Please select at least one group or individual.")
      .optional(),
    processId: z.string().uuid().optional(),
  }),
  requestInputs: z.array(requestInputSchema),
  respondPermission: z.object({
    type: z.nativeEnum(RespondTriggerType),
    agents: z
      .array(agentFormSchema)
      .min(1, "Please select at least one group or individual.")
      .optional(),
  }),
  respondInputs: z.object({
    type: z.nativeEnum(RespondInputType),
    freeText: z.object({
      type: z.nativeEnum(FreeTextResponseType),
      dataType: z.nativeEnum(FreeTextDataType),
    }),
    selectOption: z.object({
      type: z.nativeEnum(OptionsCreationType),
      processDefinedOptions: optionSchema,
    }),
    rankedChoice: z.object({
      type: z.nativeEnum(OptionsCreationType),
      processDefinedOptions: optionSchema,
    }),
  }),
  result: z.object({
    type: z.nativeEnum(ResultType),
    requestExpirationSeconds: z.number(),
    minimumResponses: z.number(),
    rawResponses: z.object({}),
    singleOption: z.object({
      type: z.nativeEnum(ResultSingleOptionType),
      percentageVote: z.object({ percentage: z.coerce.number() }),
      thresholdVote: z.object({ threshold: z.coerce.number() }),
      optimisticVote: z.object({ threshold: z.coerce.number(), defaultOptionId: z.string() }),
      // rankChoiceVote: z.object({}), // might not be anything to do here
    }),
    summary: z.object({
      type: z.nativeEnum(ResultSummaryType),
      aiTextSummary: z.object({
        prompt: z.string(),
      }),
      weightedRanking: z.object({}),
      average: z.object({}),
      sum: z.object({}),
    }),
  }),
  action: z.object({
    type: z.nativeEnum(ActionType),
    filter: z.object({
      allOptions: z.boolean(),
      optionId: z.string(),
    }),
    triggerProcess: z.object({
      processId: z.string(),
    }),
    callWebhook: z.object({
      uri: z.string().url(),
      name: z.string().min(1),
    }),
  }),
});
