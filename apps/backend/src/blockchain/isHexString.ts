export const isHexadecimal = (str: string) => {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(str);
};
