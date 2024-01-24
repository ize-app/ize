import { ethers } from "ethers";

export const ethersProvider = new ethers.AlchemyProvider(
  "mainnet",
  process.env.ALCHEMY_API_KEY as string,
);
