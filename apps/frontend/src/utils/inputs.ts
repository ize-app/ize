export const validatePositiveIntegerInput = (value: string) => {
  const onlyDigits = value.replace(/[^0-9]/g, "");
  const noLeadingZeroes = onlyDigits.replace(/^0+/, "");
  return noLeadingZeroes;
};
