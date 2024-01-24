import { Blockchain } from "@/graphql/generated/resolver-types";
import { HatsClient } from "@hatsprotocol/sdk-v1-core";

import { chainMap } from "../chainMap";
import { viemClient } from "./viemClient";

export class HatsMultichainClient {
  private readonly instances: Map<number, HatsClient> = new Map();

  constructor() {}

  forChain(chain: Blockchain): HatsClient {
    return this.loadInstance(chainMap.get(chain)?.chainId as number, chain);
  }

  /**
   * Checks if an instance of exists for the given `chain`. If not,
   * it creates one and stores it in the `instances` map.
   *
   * @private
   * @param chain
   */

  private loadInstance(chainId: number, chain: Blockchain): HatsClient {
    if (!this.instances.has(chainId)) {
      this.instances.set(
        chainId,
        new HatsClient({
          chainId,
          publicClient: viemClient.forChain(chain),
        }),
      );
    }
    return this.instances.get(chainId) as HatsClient;
  }
}
