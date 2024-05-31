import { Network } from "alchemy-sdk";

import { AlchemyMultichainClient } from "./AlchemyMultichainClient";

const defaultConfig = {
  apiKey: process.env.ALCHEMY_API_KEY as string,
  network: Network.ETH_MAINNET,
};

const overrides = {};

export const alchemyClient = new AlchemyMultichainClient(defaultConfig, overrides);
