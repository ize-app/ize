import * as z from "zod";
import { FieldDataType } from "@prisma/client";

export const validateInputDataType = (value: string, dataType: FieldDataType): boolean => {
  console.log("evaluating option value: ", value, "for data type", dataType);
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
      pass = true;
      // TODO
      // pass = z.string().datetime().safeParse(value).success;
      break;
    case FieldDataType.DateTime:
      pass = true;
      // TODO
      // pass = z.string().datetime().safeParse(value).success;
      break;
    default:
      break;
  }
  return pass;
};
