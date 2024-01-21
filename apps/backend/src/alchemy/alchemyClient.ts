import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY as string,
  network: Network.ETH_MAINNET,
};

export const alchemyClient = new Alchemy(config);
