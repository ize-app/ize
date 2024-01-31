import { alchemyClient } from "@/blockchain/clients/alchemyClient";
import { GraphqlRequestContext } from "@/graphql/context";
import { Blockchain } from "@/graphql/generated/resolver-types";

import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/client";
import { chainMap } from "@/blockchain/chainMap";
import { updateIdentitiesGroups } from "./updateIdentitiesGroups";

export const updateUserNftGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  try {
    if (!context.currentUser) throw Error("ERROR Unauthenticated user");
    const userBlockchainIdentity = context.currentUser.Identities.find(
      (id) => !!id.IdentityBlockchain,
    );
    if (!userBlockchainIdentity) return;

    const address = userBlockchainIdentity.IdentityBlockchain?.address as string;

    // iterate through each chain and get identity's NFT groups
    const res = await Promise.all(
      Array.from(chainMap).map(
        async ([chain, val]) => await getUserNftGroupsForChain({ chain, address, transaction }),
      ),
    );

    const groupIds = res.flat(1);

    await updateIdentitiesGroups({ identityId: userBlockchainIdentity.id, groupIds, transaction });
  } catch (e) {
    console.log(e);
    return;
  }
};

const getUserNftGroupsForChain = async ({
  chain,
  address,
  transaction = prisma,
}: {
  chain: Blockchain;
  address: string;
  transaction?: Prisma.TransactionClient;
}): Promise<string[]> => {
  // get all of a user's Nfts (exclude metadata) + pagination logic
  const { ownedNfts } = await alchemyClient.forChain(chain).nft.getNftsForOwner(address, {
    omitMetadata: true,
  });

  let contractAddresses = new Set<string>();
  ownedNfts.forEach((nft) => contractAddresses.add(nft.contractAddress));

  // get all groups that have a tokenId associated with them

  const tokenIdGroups = await transaction.groupNft.findMany({
    where: {
      OR: ownedNfts.map((nft) => ({
        tokenId: nft.tokenId,
        NftCollection: {
          address: nft.contractAddress,
        },
      })),
    },
  });

  // get all groups that are associated with the entire collection
  const fullCollectionGroups = await transaction.groupNft.findMany({
    where: {
      tokenId: null,
      NftCollection: {
        address: { in: Array.from(contractAddresses) },
      },
    },
  });

  const groupIds: string[] = [];

  tokenIdGroups.forEach((group) => groupIds.push(group.groupId));
  fullCollectionGroups.forEach((group) => groupIds.push(group.groupId));

  return groupIds;
};
