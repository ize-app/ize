import { Blockchain, Group, NftTypes } from "@/graphql/generated/resolver-types";
import { GraphqlRequestContext } from "../../../graphql/context";
import { prisma } from "../../../prisma/client";
import { Prisma } from "@prisma/client";
import { getNftToken } from "@/blockchain/getNftToken";
import { getNftContract } from "@/blockchain/getNftContract";
import { formatGroup, groupInclude } from "@/utils/formatGroup";
import { HATS_V1 } from "@hatsprotocol/sdk-v1-core";
import { getHatToken, parseHatToken } from "@/blockchain/getHatToken";

export const createNftGroup = async ({
  chain,
  address,
  tokenId,
  context,
  includeHatsBranch = false,
  transaction = prisma,
}: {
  chain: Blockchain;
  address: string;
  tokenId?: string | null | undefined;
  includeHatsBranch?: boolean;
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
    hatsBranch: false,
    context,
    transaction,
  });

  const group = await transaction.group.findFirstOrThrow({
    include: groupInclude,
    where: {
      GroupNft: {
        tokenId: tokenId ?? "",
        collectionId: collectionRecord.id,
        hatsBranch: false,
      },
    },
  });

  return formatGroup(group);
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
  hatsBranch = false,
  transaction = prisma,
  context,
}: {
  tokenId: string | null | undefined;
  tokenName: string | null | undefined;
  collectionId: string;
  collectionName: string | null | undefined;
  icon: string | null | undefined;
  hatsBranch?: boolean;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  await transaction.groupNft.upsert({
    where: {
      collectionId_tokenId_hatsBranch: {
        collectionId,
        hatsBranch,
        tokenId: tokenId ?? "",
      },
    },
    update: {
      icon: icon,
      name: tokenId
        ? tokenName ?? "Token ID: " + tokenId
        : (collectionName ?? "Unknown collection") + " (All tokens)",
    },
    create: {
      name: tokenId
        ? tokenName ?? "Token ID: " + tokenId
        : (collectionName ?? "Unknown collection") + " (All tokens)",
      tokenId: tokenId ?? "",
      hatsBranch: hatsBranch,
      icon: icon,
      Group: {
        create: {
          creatorId: context.currentUser?.id as string,
        },
      },
      NftCollection: {
        connect: {
          id: collectionId,
        },
      },
    },
  });
};

export const createHatsGroup = async ({
  chain,
  tokenId,
  context,
  includeHatsBranch,
  transaction = prisma,
}: {
  chain: Blockchain;
  tokenId: string;
  includeHatsBranch: boolean;
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
    hatsBranch: includeHatsBranch,
    context,
    transaction,
  });

  const group = await transaction.group.findFirstOrThrow({
    include: groupInclude,
    where: {
      GroupNft: {
        tokenId: tokenIdBigInt.toString(),
        collectionId: collectionRecord.id,
        hatsBranch: includeHatsBranch,
      },
    },
  });

  return formatGroup(group);
};
