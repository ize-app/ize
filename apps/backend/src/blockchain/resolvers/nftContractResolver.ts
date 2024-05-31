import { NftContract } from "alchemy-sdk";

import { AlchemyApiNftContract, Blockchain, NftTypes } from "@/graphql/generated/resolver-types";

export const nftContractResolver = (
  contract: NftContract,
  chain: Blockchain,
): AlchemyApiNftContract => ({
  address: contract.address,
  name: contract.name ?? contract.openSeaMetadata.collectionName,
  icon: contract.openSeaMetadata.imageUrl ?? contract.openSeaMetadata.bannerImageUrl,
  chain: chain,
  type: contract.tokenType as unknown as NftTypes,
});
