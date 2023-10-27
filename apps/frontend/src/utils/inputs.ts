import short from "short-uuid";
import * as z from "zod";

export const validatePositiveIntegerInput = (value: string) => {
  const onlyDigits = value.replace(/[^0-9]/g, "");
  const noLeadingZeroes = onlyDigits.replace(/^0+/, "");
  return noLeadingZeroes;
};

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60000);

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const findFirstLetter = (name: string): string => {
  const firstOccurence = name.search("[a-zA-Z]");
  if (firstOccurence === -1) return name[0];
  else return name[firstOccurence];
};

export const avatarString = (name: string) => {
  if (name[0] === "@") return findFirstLetter(name);
  else
    return `${name.split(" ")[0][0]}${
      name.split(" ").length > 1 ? name.split(" ")[1][0] : ""
    }`;
};

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
