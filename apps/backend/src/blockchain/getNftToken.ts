import { NftTokenType } from "alchemy-sdk";

import { GraphqlRequestContext } from "@/graphql/context";
import { alchemyClient } from "./alchemyClient/alchemyClient";
import { Blockchain } from "@/graphql/generated/resolver-types";
import { nftTokenResolver } from "./resolvers/nftTokenResolver";

export const getNftToken = async ({
  chain,
  address,
  tokenId,
  context,
}: {
  chain: Blockchain;
  address: string;
  tokenId: string;
  context: GraphqlRequestContext;
}) => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const token = await alchemyClient.forChain(chain).nft.getNftMetadata(address, tokenId);
  if (
    token.contract.tokenType !== NftTokenType.ERC1155 &&
    token.contract.tokenType !== NftTokenType.ERC721
  )
    return null;
  return nftTokenResolver(token, chain);
};
