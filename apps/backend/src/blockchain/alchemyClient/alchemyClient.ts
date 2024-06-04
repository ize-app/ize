import { Network } from "alchemy-sdk";

import { AlchemyMultichainClient, AlchemyMultichainSettings } from "./AlchemyMultichainClient";

const defaultConfig = {
  apiKey: process.env.ALCHEMY_API_KEY_ETHEREUM as string,
  network: Network.ETH_MAINNET,
};

const overrides: Partial<Record<Network, AlchemyMultichainSettings>> = {
  [Network.ETH_MAINNET]: {
    apiKey: process.env.ALCHEMY_API_KEY_ETHEREUM as string,
  },
  [Network.OPT_MAINNET]: {
    apiKey: process.env.ALCHEMY_API_KEY_OPTIMISM as string,
  },
  [Network.BASE_MAINNET]: {
    apiKey: process.env.ALCHEMY_API_KEY_BASE as string,
  },
  [Network.ARB_MAINNET]: {
    apiKey: process.env.ALCHEMY_API_KEY_ARBITRUM as string,
  },
  [Network.MATIC_MAINNET]: {
    apiKey: process.env.ALCHEMY_API_KEY_POLYGON as string,
  },
};

export const alchemyClient = new AlchemyMultichainClient(defaultConfig, overrides);
