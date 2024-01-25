import { ApiHatToken, Blockchain } from "@/graphql/generated/resolver-types";
import { isBigIntString } from "./isBigIntSting";
import { isHexadecimal } from "./isHexString";
import { hatIdHexToDecimal, hatIdDecimalToIp } from "@hatsprotocol/sdk-v1-core";
import { hatsClient } from "./clients/hatsClient";
import { getIpfsUrl } from "./getIpfsUrl";

interface HatIpfsDetails {
  type: string;
  data: {
    name?: string;
    description?: string;
  };
}

// Hats tokens will be passed in either decimal string format or hex format
export const parseHatToken = (tokenId: string): bigint => {
  const isHex = isHexadecimal(tokenId.substring(2));
  const isBigInt = isBigIntString(tokenId);

  if (!isHex && !isBigInt)
    throw Error("Error: Not valid token Id format. Must be hexadecimal or decimal");

  const tokenBigInt = isHex ? hatIdHexToDecimal(tokenId) : BigInt(tokenId);
  return tokenBigInt;
};

export const getHatToken = async ({
  tokenId,
  chain,
}: {
  tokenId: bigint;
  chain: Blockchain;
}): Promise<ApiHatToken> => {
  const hat = await hatsClient.forChain(chain).viewHat(tokenId);
  const res = await fetch(getIpfsUrl(hat.details));
  const details: HatIpfsDetails = await res.json();

  const name = details.data.name;
  const description = details.data.description;
  const icon = hat.imageUri ? getIpfsUrl(hat.imageUri) : null;

  return {
    chain,
    tokenId: tokenId.toString(),
    readableTokenId: hatIdDecimalToIp(tokenId),
    name,
    description,
    icon,
    // TODO: Add top hat info
    topHatName: "",
    topHatIcon: "icon",
  };
};
