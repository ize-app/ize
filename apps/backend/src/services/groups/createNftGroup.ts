import { Blockchain, Group, NftTypes } from "@/graphql/generated/resolver-types";
import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { getNftToken } from "@/blockchain/getNftToken";
import { getNftContract } from "@/blockchain/getNftContract";
import { formatGroup, groupInclude } from "@/utils/formatGroup";
import { hatsClient } from "@/blockchain/clients/hatsClient";
import { isHexString } from "alchemy-sdk/dist/src/api/utils";
import { isBigIntString } from "@/blockchain/isBigIntSting";
import { hatIdHexToDecimal } from "@hatsprotocol/sdk-v1-core";
import { getIpfsUrl } from "@/blockchain/getIpfsUrl";

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

  if (!nftContract || !nftToken) throw Error();

  const collectionRecord = await upsertNftCollection({
    chain,
    address,
    name: nftToken?.contract.name ?? nftContract?.name,
    icon: nftToken?.contract.icon ?? nftContract?.icon,
    type: nftToken?.contract.type ?? nftContract?.type,
  });

  await transaction.groupNft.upsert({
    where: {
      collectionId_hatsBranch_tokenId_allTokens: {
        collectionId: collectionRecord.id,
        hatsBranch: false,
        tokenId: tokenId ?? "",
        allTokens: !!tokenId,
      },
    },
    update: {
      icon: nftToken?.icon,
      name: nftToken
        ? nftToken.name ?? "Token ID: " + tokenId
        : nftContract?.name + " (All tokens)",
    },
    create: {
      name: nftToken
        ? nftToken.name ?? "Token ID: " + tokenId
        : nftContract?.name + " (All tokens)",
      allTokens: tokenId ? false : true,
      tokenId: tokenId ?? "",
      icon: nftToken?.icon,
      Group: {
        create: {
          creatorId: context.currentUser?.id as string,
        },
      },
      NftCollection: {
        connect: {
          id: collectionRecord.id,
        },
      },
    },
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
}): Promise<string> => {
  // TODO: test if hex format

  const isHex = isHexString(tokenId);
  const isBigInt = isBigIntString(tokenId);

  if (!isHex && !isBigInt)
    throw Error("Error: Not valid token Id format. Must be hexadecimal or decimal");

  const tokenBigInt = isHex ? hatIdHexToDecimal(tokenId) : BigInt(tokenId);

  const hat = await hatsClient.forChain(chain).viewHat(tokenBigInt);
  console.log("hat is ", hat);

  const details = await fetch(getIpfsUrl(hat.details));

  console.log("details are ", details);

  const res = await fetch(
    "https://ipfs.io/ipfs/bafkreidfbnrwqown67tjdzscww52gwhlflbhomhls63jmsic64i4j5adfq",
  );

  console.log("res is ", res);

  //TODO
  // strip off ipfs from beginning ipfs:// of the
  // query that url and parse the json
  // get the details.name field and imageUri
  // strip off ipfs of imageUrI and construct that uri
  // create upsert query for them both

  // upsert for the hats contract

  // abstract out the upsert token logic into it's own function
  // upsert for the token itself

  // TODO: seperate but I also need to make an endpoint for querying hats (hex or decimal)
  // so I can probably move most of this into its own function

  // TODO - do I need to do something with http?
  return "";
};
