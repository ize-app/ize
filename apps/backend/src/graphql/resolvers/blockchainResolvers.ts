import { alchemyClient } from "@/blockchain/alchemyClient/alchemyClient";
import { getHatToken, parseHatToken } from "@/blockchain/getHatToken";
import { getNftContract } from "@/blockchain/getNftContract";
import { getNftToken } from "@/blockchain/getNftToken";
import { nftContractResolver } from "@/blockchain/resolvers/nftContractResolver";

import { GraphqlRequestContext } from "../context";
import {
  AlchemyApiNftContract,
  AlchemyApiNftToken,
  ApiHatToken,
  QueryHatTokenArgs,
  QueryNftContractArgs,
  QueryNftTokenArgs,
  QuerySearchNftContractsArgs,
} from "../generated/resolver-types";

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

const hatToken = async (
  root: unknown,
  args: QueryHatTokenArgs,
  context: GraphqlRequestContext,
): Promise<ApiHatToken | null> => {
  return await getHatToken({ tokenId: parseHatToken(args.tokenId), chain: args.chain });
};

// TODO: rate limit this
const searchNftContracts = async (
  root: unknown,
  args: QuerySearchNftContractsArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftContract[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const results = await alchemyClient.forChain(args.chain).nft.searchContractMetadata(args.query);
  const formattedReults = results.contracts.map((contract) =>
    nftContractResolver(contract, args.chain),
  );
  return formattedReults;
};

export const blockchainQueries = {
  nftContract,
  nftToken,
  hatToken,
  searchNftContracts,
};
