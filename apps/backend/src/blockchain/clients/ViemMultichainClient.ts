import { Blockchain } from "@/graphql/generated/resolver-types";
import { chainMap } from "../chainMap";

import { createPublicClient, http, PublicClient } from "viem";
import { Chain } from "viem/chains";

export class ViemMultichainClient {
  private readonly instances: Map<Chain, PublicClient> = new Map();

  constructor() {}

  forChain(chain: Blockchain): PublicClient {
    return this.loadInstance(chainMap.get(chain)?.viem as Chain);
  }

  /**
   * Checks if an instance of exists for the given `chain`. If not,
   * it creates one and stores it in the `instances` map.
   *
   * @private
   * @param chain
   */
  private loadInstance(chain: Chain): PublicClient {
    if (!this.instances.has(chain)) {
      this.instances.set(
        chain,
        createPublicClient({
          chain,
          transport: http(),
        }),
      );
    }
    return this.instances.get(chain) as PublicClient;
  }
}
