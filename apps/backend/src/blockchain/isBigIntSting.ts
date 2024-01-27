export const isBigIntString = (str: string) => {
  try {
    BigInt(str);
    return true;
  } catch {
    return false;
  }
};
