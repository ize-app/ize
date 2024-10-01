import short from "short-uuid";

const translator = short();

export const fullUUIDToShort = (uuid: string): string => {
  return translator.fromUUID(uuid);
};

export const shortUUIDToFull = (shortenedUUID: string): string => {
  return translator.toUUID(shortenedUUID);
};
