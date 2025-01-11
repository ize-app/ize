import dayjs, { Dayjs } from "dayjs";
import * as z from "zod";

import { OptionSelectionType, ValueType } from "@/graphql/generated/graphql";

import { entityFormSchema } from "../formValidation/entity";
import { flowReferenceSchema } from "../formValidation/flowSummary";

export type InputSchemaType = z.infer<typeof inputSchema>;
export type InputRecordSchemaType = z.infer<typeof inputRecordSchema>;

export type OptionSelectionValuesSchemaType = z.infer<typeof optionSelectionValuesSchema>;
export type OptionSelectionValueSchemaType = z.infer<typeof optionSelectionValueSchema>;
export type OptionSchemaType = z.infer<typeof optionSchema>;

export const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");

const dayjsSchema = z.custom<dayjs.Dayjs>((value) => dayjs.isDayjs(value), {
  message: "Invalid Day.js object",
});

// the actual values that are selected on an options field
export const optionSelectionValueSchema = z.object({ optionId: z.string().min(1) });
export const optionSelectionValuesSchema = z.preprocess((data) => {
  // the Radio field component creates formState of [{optionId: undefined}] when radio button is not selected.
  // This is a workaround to filter out the invalid optionId
  if (Array.isArray(data)) {
    // eslint-disable-next-line
    return data.filter((item) => item && !!item.optionId);
  }
  return [];
}, z.array(optionSelectionValueSchema).default([]));

export const inputSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal(ValueType.String),
      required: z.boolean().default(true),
      value: z.union([z.string().min(1, { message: "Invalid text" }), z.literal("")]).default(""),
    }),
    z.object({
      type: z.literal(ValueType.Float),
      required: z.boolean().default(true),
      value: z
        .union([z.number().or(z.string().min(1)).pipe(z.coerce.number()), z.literal("")])
        .default(""),
    }),
    z.object({
      type: z.literal(ValueType.Uri),
      required: z.boolean().default(true),
      value: z
        .union([
          z.object({ uri: z.string().url(), name: z.string().min(1) }),
          z.object({ uri: z.literal(""), name: z.literal("") }),
        ])
        .default({ uri: "", name: "" }),
    }),
    z.object({
      type: z.literal(ValueType.Date),
      required: z.boolean().default(true),
      value: dayjsSchema.nullable().default(null),
    }),
    z.object({
      type: z.literal(ValueType.DateTime),
      required: z.boolean().default(true),
      value: dayjsSchema.nullable().default(null), //.default(dayjs()),
    }),
    z.object({
      type: z.literal(ValueType.Entities),
      required: z.boolean().default(true),
      value: z.array(entityFormSchema).default([]),
    }),
    z.object({
      type: z.literal(ValueType.Flows),
      required: z.boolean().default(true),
      value: z.array(flowReferenceSchema).default([]),
    }),
    z.object({
      type: z.literal(ValueType.FlowVersion),
      required: z.boolean().default(true),
      // TODO this default value should be changed to something else in the future
      value: flowReferenceSchema.nullable(),
    }),
    z.object({
      type: z.literal(ValueType.OptionSelections),
      value: optionSelectionValuesSchema,
      required: z.boolean().default(true),
      maxSelections: z.number().nullable(),
      selectionType: z.nativeEnum(OptionSelectionType),
    }),
  ])
  // admittedly, this is clunky. I'm not sure how to make this more elegant
  // the difficulty here is 1) toggling on/off required fields and 2) sending the error message to the correct path depending on the component
  .superRefine(
    (field, ctx) => {
      if (field.required) {
        switch (field.type) {
          case ValueType.String:
            if (field.value === "")
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
          case ValueType.Float:
            if (field.value === "")
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
          case ValueType.Entities:
            if (field.value.length === 0)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
          case ValueType.Flows:
            if (field.value.length === 0)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
          case ValueType.Uri:
            if (field.value.uri === "" || field.value.name === "")
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value", "uri"],
              });
            break;
          case ValueType.OptionSelections:
            if (field.value.length === 0) {
              if (field.maxSelections === 1) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Required",
                  path: ["value", 0, "optionId"],
                });
              } else {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Required",
                  path: ["value"],
                });
              }
            }
            break;
          case ValueType.Date:
            if (field.value === null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
          case ValueType.DateTime:
            if (field.value === null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
          // TODO
          case ValueType.FlowVersion:
            if (field.value === null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Required",
                path: ["value"],
              });
            break;
        }
      } else return true;
    },
    // { message: "Required" },
  )
  .superRefine((field, ctx) => {
    if (field.type === ValueType.OptionSelections) {
      if (field.maxSelections && field.maxSelections < field.value.length) {
        console.log("Error: option selections exceeded");
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only a maximum of " + field.maxSelections + " selections are allowed",
          path: ["value"],
        });
      }
    }
  });

export const optionSchema = z.object({
  optionId: z.string().uuid(),
  input: inputSchema,
});

export const inputRecordSchema = z.record(z.string().min(1), inputSchema);
