import { GraphqlRequestContext } from "../context";
import {
  AlchemyApiNftContract,
  AlchemyApiNftToken,
  QueryNftContractArgs,
  QueryNftTokenArgs,
  QuerySearchNftContractsArgs,
} from "../generated/resolver-types";

import { alchemyClient } from "@/blockchain/clients/alchemyClient";
import { formatNftContract } from "@/blockchain/formatNftContract";
import { getNftContract } from "@/blockchain/getNftContract";
import { getNftToken } from "@/blockchain/getNftToken";

const nftContract = async (
  root: unknown,
  args: QueryNftContractArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftContract | null> => {
  return await getNftContract({ context, chain: args.chain, address: args.address });
};

const nftToken = async (
  root: unknown,
  args: QueryNftTokenArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftToken | null> => {
  return await getNftToken({
    context,
    chain: args.chain,
    address: args.address,
    tokenId: args.tokenId,
  });
};

// TODO: rate limit this
const searchNftContracts = async (
  root: unknown,
  args: QuerySearchNftContractsArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftContract[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const results = await alchemyClient.forChain(args.chain).nft.searchContractMetadata(args.query);
  const formattedReults = results.contracts
    // .filter((contract) => contract.tokenType === (NftTokenType.ERC1155 || NftTokenType.ERC721))
    .map((contract) => formatNftContract(contract, args.chain));
  return formattedReults;
};

export const blockchainQueries = {
  nftContract,
  nftToken,
  searchNftContracts,
};
