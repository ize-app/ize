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

export const avatarString = (name: string) =>
  `${name.split(" ")[0][0]}${
    name.split(" ").length > 1 ? name.split(" ")[1][0] : ""
  }`;
