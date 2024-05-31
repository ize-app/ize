import { Network } from "alchemy-sdk";
import { Chain, arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

import { Blockchain } from "@/graphql/generated/resolver-types";

interface ChainAttributes {
  chainId: number;
  alchemy: Network;
  viem: Chain;
}

// mapping internal datatype of chain to external datatypes
export const chainMap = new Map<Blockchain, ChainAttributes>([
  [Blockchain.Ethereum, { alchemy: Network.ETH_MAINNET, viem: mainnet, chainId: 1 }],
  [Blockchain.Optimism, { alchemy: Network.OPT_MAINNET, viem: optimism, chainId: 10 }],
  [Blockchain.Matic, { alchemy: Network.MATIC_MAINNET, viem: polygon, chainId: 137 }],
  [Blockchain.Arbitrum, { alchemy: Network.ARB_MAINNET, viem: arbitrum, chainId: 42161 }],
  [Blockchain.Base, { alchemy: Network.BASE_MAINNET, viem: base, chainId: 8453 }],
]);
