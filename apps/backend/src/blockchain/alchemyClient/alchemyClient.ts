import { Network } from "alchemy-sdk";

import config from "@/config";

import { AlchemyMultichainClient, AlchemyMultichainSettings } from "./AlchemyMultichainClient";

const defaultConfig = {
  apiKey: config.ALCHEMY_API_KEY as string,
  network: Network.ETH_MAINNET,
};

const overrides: Partial<Record<Network, AlchemyMultichainSettings>> = {
  [Network.ETH_MAINNET]: {},
  [Network.OPT_MAINNET]: {},
  [Network.BASE_MAINNET]: {},
  [Network.ARB_MAINNET]: {},
  [Network.MATIC_MAINNET]: {},
};

export const alchemyClient = new AlchemyMultichainClient(defaultConfig, overrides);
