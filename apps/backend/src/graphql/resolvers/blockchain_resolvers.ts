import { GraphqlRequestContext } from "../context";
import {
  AlchemyApiNftContract,
  AlchemyApiNftToken,
  QueryNftContractArgs,
  QueryNftTokenArgs,
  QuerySearchNftContractsArgs,
} from "../generated/resolver-types";

import { alchemyClient } from "@/alchemy/alchemyClient";
import { formatNftContract } from "@/alchemy/formatNftContract";
import { getNftContract } from "@/alchemy/getNftContract";
import { getNftToken } from "@/alchemy/getNftToken";

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
