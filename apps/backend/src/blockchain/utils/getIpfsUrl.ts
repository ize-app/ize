export const getIpfsUrl = (str: string) => {
  const ipfsSearchPattern = "ipfs://";
  if (str.search(ipfsSearchPattern) === -1) throw Error("Error: Invalid IPFS string");
  return str.replace("ipfs://", "https://ipfs.io/ipfs/");
};
