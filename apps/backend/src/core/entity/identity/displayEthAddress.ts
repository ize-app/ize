const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const displayEthAddress = (address: string) => {
  try {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `0x…${match[2]}`;
  } catch {
    return address;
  }
};
