import { prisma } from "../../../../prisma/client";
import { GraphqlRequestContext } from "../../../../graphql/context";
import { Blockchain, NewEntityArgs } from "@graphql/generated/resolver-types";

import { viemClient } from "@/blockchain/viemClient/viemClient";
import { normalize } from "viem/ens";
import { isAddress } from "viem";
import { IdentityPrismaType } from "../identityPrismaTypes";
import { identityResolver } from "../identityResolver";

export const upsertBlockchainIdentity = async ({
  newEntity,
  context,
}: {
  newEntity: NewEntityArgs;
  context: GraphqlRequestContext;
}) => {
  if (!newEntity.identityBlockchain)
    throw Error("ERROR: upsertIdentityBlockchain - missing identityBlockchain");

  const isWallet = isAddress(newEntity.identityBlockchain.address);
  const ensRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const isEns = !!newEntity.identityBlockchain.address.match(ensRegex);
  if (!isWallet && !isEns) throw Error("Error: Invalid address / ens input");
  const ensAddress = isEns
    ? await viemClient.forChain(Blockchain.Ethereum).getEnsAddress({
        name: normalize(newEntity.identityBlockchain.address),
      })
    : null;

  const wallet = (ensAddress ?? newEntity.identityBlockchain.address).toLowerCase();

  const res = await prisma.identityBlockchain.upsert({
    include: {
      Identity: {
        include: {
          IdentityBlockchain: true,
        },
      },
    },
    where: {
      address: wallet,
    },
    update: isEns
      ? {
          ens: newEntity.identityBlockchain.address.toLowerCase(),
        }
      : {},
    create: {
      address: wallet,
      ens: isEns ? newEntity.identityBlockchain.address.toLowerCase() : null,
      Identity: {
        create: {
          Entity: { create: {} },
        },
      },
    },
  });

  return identityResolver(
    res.Identity as IdentityPrismaType,
    context.currentUser?.Identities.map((i) => i.id) ?? [],
    false,
  );
};
