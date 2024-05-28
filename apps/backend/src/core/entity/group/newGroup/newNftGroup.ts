import { HATS_V1 } from "@hatsprotocol/sdk-v1-core";
import { Prisma } from "@prisma/client";

import { getHatToken, parseHatToken } from "@/blockchain/getHatToken";
import { getNftContract } from "@/blockchain/getNftContract";
import { getNftToken } from "@/blockchain/getNftToken";
import { Blockchain, Group, NftTypes } from "@/graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../../../graphql/context";
import { prisma } from "../../../../prisma/client";
import { groupInclude } from "../groupPrismaTypes";
import { groupResolver } from "../groupResolver";


export const newNftGroup = async ({
  chain,
  address,
  tokenId,
  context,
  transaction = prisma,
}: {
  chain: Blockchain;
  address: string;
  tokenId?: string | null | undefined;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<Group> => {
  const nftToken = tokenId
    ? await getNftToken({
        context,
        chain: chain,
        address: address,
        tokenId: tokenId,
      })
    : null;

  const nftContract = tokenId
    ? null
    : await getNftContract({
        context,
        chain,
        address,
      });

  if (!nftContract && !nftToken) throw Error();

  const collectionRecord = await upsertNftCollection({
    chain,
    address,
    name: nftToken?.contract.name ?? nftContract?.name,
    icon: nftToken?.contract.icon ?? nftContract?.icon,
    type: (nftToken?.contract.type ?? nftContract?.type) as NftTypes,
  });

  await upsertNftTokenGroup({
    tokenId,
    tokenName: nftToken?.name,
    icon: nftToken?.icon,
    collectionName: collectionRecord.name,
    collectionId: collectionRecord.id,
    context,
    transaction,
  });

  const group = await transaction.group.findFirstOrThrow({
    include: groupInclude,
    where: {
      GroupNft: {
        tokenId: tokenId ?? "",
        collectionId: collectionRecord.id,
      },
    },
  });

  return groupResolver(group);
};

const upsertNftCollection = async ({
  chain,
  address,
  name,
  icon,
  type,
  transaction = prisma,
}: {
  chain: Blockchain;
  address: string;
  name: string | null | undefined;
  icon: string | null | undefined;
  type: NftTypes;
  transaction?: Prisma.TransactionClient;
}) => {
  return await transaction.nftCollection.upsert({
    where: {
      chain_address: {
        chain,
        address,
      },
    },
    update: {
      name,
      icon,
      type,
    },
    create: {
      chain,
      address,
      name,
      icon,
      type,
    },
  });
};

const upsertNftTokenGroup = async ({
  tokenId,
  tokenName,
  collectionId,
  collectionName,
  icon,
  transaction = prisma,
  context,
}: {
  tokenId: string | null | undefined;
  tokenName: string | null | undefined;
  collectionId: string;
  collectionName: string | null | undefined;
  icon: string | null | undefined;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  const existingGroup = await transaction.groupNft.findUnique({
    where: {
      collectionId_tokenId: {
        collectionId,
        tokenId: tokenId ?? "",
      },
    },
  });

  if (existingGroup) {
    await transaction.groupNft.update({
      where: {
        id: existingGroup.id,
      },
      data: {
        icon: icon,
        name: tokenId
          ? tokenName ?? "Token ID: " + tokenId
          : (collectionName ?? "Unknown collection") + " (All tokens)",
      },
    });
  } else {
    await transaction.entity.create({
      data: {
        Group: {
          create: {
            creatorId: context.currentUser?.id as string,
            GroupNft: {
              create: {
                name: tokenId
                  ? tokenName ?? "Token ID: " + tokenId
                  : (collectionName ?? "Unknown collection") + " (All tokens)",
                tokenId: tokenId ?? "",
                icon: icon,
                NftCollection: {
                  connect: {
                    id: collectionId,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
};

export const createHatsGroup = async ({
  chain,
  tokenId,
  context,
  transaction = prisma,
}: {
  chain: Blockchain;
  tokenId: string;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<Group> => {
  const tokenIdBigInt = parseHatToken(tokenId);
  const hat = await getHatToken({ tokenId: tokenIdBigInt, chain });

  const collectionRecord = await upsertNftCollection({
    chain,
    address: HATS_V1,
    name: "Hats Protocol v1",
    icon: null,
    type: NftTypes.Erc1155,
  });

  await upsertNftTokenGroup({
    tokenId: hat.tokenId,
    tokenName: hat.name,
    icon: hat.icon,
    collectionName: collectionRecord.name,
    collectionId: collectionRecord.id,
    context,
    transaction,
  });

  const group = await transaction.group.findFirstOrThrow({
    include: groupInclude,
    where: {
      GroupNft: {
        tokenId: tokenIdBigInt.toString(),
        collectionId: collectionRecord.id,
      },
    },
  });

  return groupResolver(group);
};
