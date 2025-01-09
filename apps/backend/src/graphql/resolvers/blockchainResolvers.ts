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
import { logResolverError } from "../logResolverError";

const nftContract = async (
  root: unknown,
  args: QueryNftContractArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftContract | null> => {
  try {
    return await getNftContract({ context, chain: args.chain, address: args.address });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: { tags: { resolver: "nftContract", operation: "query" }, contexts: { args } },
    });
  }
};

const nftToken = async (
  root: unknown,
  args: QueryNftTokenArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftToken | null> => {
  try {
    return await getNftToken({
      context,
      chain: args.chain,
      address: args.address,
      tokenId: args.tokenId,
    });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: { tags: { resolver: "nftToken", operation: "query", location: "graphql",  }, contexts: { args } },
    });
  }
};

const hatToken = async (
  root: unknown,
  args: QueryHatTokenArgs,
  context: GraphqlRequestContext,
): Promise<ApiHatToken | null> => {
  try {
    return await getHatToken({ tokenId: parseHatToken(args.tokenId), chain: args.chain });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: { tags: { resolver: "hatToken", operation: "query", location: "graphql",  }, contexts: { args } },
    });
  }
};

// TODO: rate limit this
// this isn't been used right now, maybe delete
const searchNftContracts = async (
  root: unknown,
  args: QuerySearchNftContractsArgs,
  context: GraphqlRequestContext,
): Promise<AlchemyApiNftContract[]> => {
  try {
    if (!context.currentUser) throw Error("ERROR Unauthenticated user");
    const results = await alchemyClient.forChain(args.chain).nft.searchContractMetadata(args.query);
    const formattedReults = results.contracts.map((contract) =>
      nftContractResolver(contract, args.chain),
    );
    return formattedReults;
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: { tags: { resolver: "searchNftContracts", operation: "query", location: "graphql",  }, contexts: { args } },
    });
  }
};

export const blockchainQueries = {
  nftContract,
  nftToken,
  hatToken,
  searchNftContracts,
};
