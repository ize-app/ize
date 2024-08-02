import { FieldDataType } from "@prisma/client";
import * as z from "zod";

export const validateInput = (value: string, dataType: FieldDataType): boolean => {
  let pass = false;
  switch (dataType) {
    case FieldDataType.String:
      pass = z.string().min(1).safeParse(value).success;
      break;
    case FieldDataType.Uri:
      pass = z.string().url().safeParse(value).success;
      break;
    case FieldDataType.Number:
      pass = z.coerce.number().safeParse(value).success;
      break;
    case FieldDataType.Date:
      // TODO: Make this fail if the date is not in the format YYYY-MM-DD
      pass = z.string().pipe(z.coerce.date()).safeParse(value).success;
      break;
    case FieldDataType.DateTime:
      pass = z.string().pipe(z.coerce.date()).safeParse(value).success;
      break;
    case FieldDataType.FlowVersionId:
      pass = z.string().uuid().safeParse(value).success;
      break;
    case FieldDataType.EntityIds:
      pass = z.array(z.string().uuid()).safeParse(JSON.parse(value)).success;
      break;
    case FieldDataType.FlowIds:
      pass = z.array(z.string().uuid()).safeParse(JSON.parse(value)).success;
      break;
    case FieldDataType.Webhook:
      pass = z.string().uuid().safeParse(value).success;
      break;
    default:
      break;
  }
  return pass;
};
