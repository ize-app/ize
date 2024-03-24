import * as z from "zod";
import dayjs, { Dayjs } from "dayjs";
import { FieldDataType } from "@/graphql/generated/graphql";

export const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");

export const evaluateMultiTypeInput = (
  value: string,
  type: FieldDataType,
  errorPath: (string | number)[],
  ctx: z.RefinementCtx,
) => {
  switch (type) {
    case FieldDataType.Uri:
      if (!z.string().url().safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid Url",
          path: errorPath,
        });
      return;
    case FieldDataType.String:
      if (!z.string().min(1).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "url",
          message: "Invalid text",
          path: errorPath,
        });
      return;
    case FieldDataType.Number:
      if (!z.number().or(z.string().min(1)).pipe(z.coerce.number()).safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid number",
          path: errorPath,
        });
      return;
    case FieldDataType.Date:
      if (!zodDay.safeParse(value).success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date",
          path: errorPath,
        });
      return;
    case FieldDataType.DateTime:
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
