import { AlchemyApiNftToken, Blockchain } from "@/graphql/generated/resolver-types";
import { Nft } from "alchemy-sdk";
import { nftContractResolver } from "./nftContractResolver";

export const nftTokenResolver = (token: Nft, chain: Blockchain): AlchemyApiNftToken => ({
  chain,
  tokenId: token.tokenId,
  icon: token.image.thumbnailUrl ?? token.image.cachedUrl ?? token.image.originalUrl,
  name: token.name,
  contract: nftContractResolver(token.contract, chain),
});
