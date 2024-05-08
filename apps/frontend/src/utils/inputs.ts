import short from "short-uuid";
import * as z from "zod";

export const validatePositiveIntegerInput = (value: string) => {
  const onlyDigits = value.replace(/[^0-9]/g, "");
  const noLeadingZeroes = onlyDigits.replace(/^0+/, "");
  return noLeadingZeroes;
};

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60000);

//using milliseconds because that's how native JS expresses time intervals
export const intervalToIntuitiveTimeString = (milliseconds: number): string => {
  const remainingMinutes = milliseconds / (1000 * 60);
  let unit: string;

  const unitToMinutesMap: { [key: string]: number } = {
    minute: 1,
    hour: 60,
    day: 60 * 24,
  };

  if (remainingMinutes < 60) unit = "minute";
  else if (remainingMinutes < 60 * 24) unit = "hour";
  else unit = "day";

  const interval = Math.ceil(remainingMinutes / unitToMinutesMap[unit]);
  return `${interval.toString()} ${unit}${interval > 1 ? "s" : ""}`;
};

//  JS coerces empty to strings to a zero value so we're changing empty strings to zero to remove this ambiguity
export const zodCleanNumber = (zodPipe: z.ZodTypeAny) =>
  z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : Number(value)))
    .pipe(zodPipe);

// making empty strings undefined so that "no selection" is defined consistently
export const zodCleanString = (zodPipe: z.ZodTypeAny) =>
  z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .pipe(zodPipe);

export const fullUUIDToShort = (uuid: string): string => {
  const translator = short();
  return translator.fromUUID(uuid);
};

export const shortUUIDToFull = (shortenedUUID: string): string => {
  const translator = short();
  return translator.toUUID(shortenedUUID);
};

interface ObjectWithId {
  id: string;
}

export const deduplicateArrayById = (inputArray: ObjectWithId[]) => {
  const uniqueMap = new Map();

  for (const obj of inputArray) {
    uniqueMap.set(obj.id, obj);
  }

  return Array.from(uniqueMap.values());
};
