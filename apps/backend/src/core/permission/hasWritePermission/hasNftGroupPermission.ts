import { Blockchain } from "@/graphql/generated/resolver-types";
import { HATS_V1 } from "@hatsprotocol/sdk-v1-core";

import { alchemyClient } from "@/blockchain/alchemyClient/alchemyClient";
import { GroupNftPrismaType } from "@/core/entity/group/groupPrismaTypes";
import { hatsClient } from "@/blockchain/hatsClient/hatsClient";
import { IdentityPrismaType } from "@/core/entity/identity/identityPrismaTypes";

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
export const hasNftGroupPermission = async ({
  nftGroups,
  userIdentities,
}: {
  nftGroups: GroupNftPrismaType[];
  userIdentities: IdentityPrismaType[];
}): Promise<boolean> => {
  let foundRole = false;

  const userAddress = userIdentities.find((id) => !!id.IdentityBlockchain)?.IdentityBlockchain
    ?.address;

  if (!userAddress) return false;

  if (nftGroups.length === 0) return false;

  const tokensByChain = new Map<Blockchain, GroupNftPrismaType[]>();

  // seperate out NFTs into each chain
  nftGroups.forEach((role) => {
    if (!role) return;
    if (tokensByChain.has(role.NftCollection.chain as Blockchain)) {
      (tokensByChain.get(role.NftCollection.chain as Blockchain) as GroupNftPrismaType[]).push(
        role,
      );
    } else {
      // Key doesn't exist, so create a new entry with an array containing the value
      tokensByChain.set(role?.NftCollection.chain as Blockchain, [role]);
    }
    role?.NftCollection.chain;
  });

  // get owners NFts by chain
  for (let [chain, nfts] of tokensByChain.entries()) {
    if (foundRole === true) break;
    // create unique list of collections that are assigned roles
    let contractAddresses = new Set<string>();
    nfts.forEach((nft) => contractAddresses.add(nft.NftCollection.address));
    // get all of a user's nfts
    const { ownedNfts } = await alchemyClient.forChain(chain).nft.getNftsForOwner(userAddress, {
      omitMetadata: true,
      contractAddresses: Array.from(contractAddresses),
    });

    for (let i = 0; i <= nfts.length - 1; i++) {
      const nft = nfts[i];
      // check whether user has permission depending on the type of the nft
      // allTokens means that any token in collection has access to this role
      if (!nft.tokenId) {
        if (ownedNfts.some((ownedNft) => ownedNft.contractAddress === nft.NftCollection.address))
          return true; // TODO: this is probebly not quite right
      }
      // hats tokens have special logic to determine 1) if the hat is active
      // and 2) whether the role applies to tokens further down in the hats tree
      else if (nft.NftCollection.address === HATS_V1) {
        const isWearer = await hatsClient.forChain(chain).isWearerOfHat({
          wearer: userAddress as `0x${string}`,
          hatId: BigInt(nft.tokenId),
        });
        if (isWearer) foundRole = true;
      }
      // for all other nfts, it's just whether or not you have that particular token
      else {
        if (
          ownedNfts.some(
            (ownedNft) =>
              ownedNft.contractAddress === nft.NftCollection.address &&
              ownedNft.tokenId === nft.tokenId,
          )
        )
          foundRole = true;
      }
      if (foundRole === true) break;
    }
  }

  return foundRole;
};
