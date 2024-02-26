import * as z from "zod";
import dayjs, { Dayjs } from "dayjs";

export const zodDay = z.custom<Dayjs>((val) => {
  if (val instanceof dayjs) {
    const date = val as Dayjs;
    return date.isValid();
  }
  return false;
}, "Invalid date");
