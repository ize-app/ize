import { AlchemyApiNftToken, Blockchain } from "@/graphql/generated/resolver-types";
import { Nft } from "alchemy-sdk";
import { formatNftContract } from "./formatNftContract";

export const formatNftToken = (token: Nft, chain: Blockchain): AlchemyApiNftToken => ({
  chain,
  tokenId: token.tokenId,
  icon: token.image.thumbnailUrl ?? token.image.cachedUrl ?? token.image.originalUrl,
  name: token.name,
  contract: formatNftContract(token.contract, chain),
});
