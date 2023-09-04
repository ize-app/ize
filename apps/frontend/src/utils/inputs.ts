export const validatePositiveIntegerInput = (value: string) => {
  console.log("value:", value);
  const onlyDigits = value.replace(/[^0-9]/g, "");
  const noLeadingZeroes = onlyDigits.replace(/^0+/, "");

  console.log("noLeadingZeroes:", noLeadingZeroes);

  return noLeadingZeroes;
};
