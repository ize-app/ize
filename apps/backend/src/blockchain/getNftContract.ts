import { NftTokenType } from "alchemy-sdk";

import { GraphqlRequestContext } from "@/graphql/context";
import { Blockchain } from "@/graphql/generated/resolver-types";

import { alchemyClient } from "./alchemyClient/alchemyClient";
import { nftContractResolver } from "./resolvers/nftContractResolver";

export const getNftContract = async ({
  chain,
  address,
  context,
}: {
  chain: Blockchain;
  address: string;
  context: GraphqlRequestContext;
}) => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const contract = await alchemyClient.forChain(chain).nft.getContractMetadata(address);
  if (contract.tokenType !== NftTokenType.ERC1155 && contract.tokenType !== NftTokenType.ERC721)
    return null;
  return nftContractResolver(contract, chain);
};
