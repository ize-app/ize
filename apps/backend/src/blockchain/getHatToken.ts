import { hatIdDecimalToIp, hatIdHexToDecimal } from "@hatsprotocol/sdk-v1-core";

import { ApiHatToken, Blockchain } from "@/graphql/generated/resolver-types";

import { hatsClient } from "./hatsClient/hatsClient";
import { getIpfsUrl } from "./utils/getIpfsUrl";
import { isBigIntString } from "./utils/isBigIntSting";
import { isHexadecimal } from "./utils/isHexString";

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
  const details: HatIpfsDetails = (await res.json()) as HatIpfsDetails;

  const name = details.data.name;
  const description = details.data.description;
  const icon = hat.imageUri ? getIpfsUrl(hat.imageUri) : null;

  // This query is too slow, removing it for now
  // const domain = await hatsClient.forChain(chain).getTopHatDomain(tokenId);
  // const topHatTokenId = treeIdToTopHatId(domain);
  // const topHat = await hatsClient.forChain(chain).viewHat(topHatTokenId);
  // const resTopHat = await fetch(getIpfsUrl(topHat.details));
  // const topHatDetails: HatIpfsDetails = await resTopHat.json();
  // const topHatName = topHatDetails.data.name;
  // const topHatIcon = topHat.imageUri ? getIpfsUrl(topHat.imageUri) : null;

  return {
    chain,
    tokenId: tokenId.toString(),
    readableTokenId: hatIdDecimalToIp(tokenId),
    name,
    description,
    icon,
    topHatName: "",
    topHatIcon: "",
  };
};
