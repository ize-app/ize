import { prisma } from "../../../prisma/client";
import { GraphqlRequestContext } from "../../../graphql/context";
import { Blockchain, NewAgentArgs } from "@graphql/generated/resolver-types";

import { viemClient } from "@/blockchain/clients/viemClient";
import { normalize } from "viem/ens";
import { isAddress } from "viem";
import { IdentityPrismaType, formatIdentity } from "@/core/entity/identity/formatIdentity";

export const upsertBlockchainIdentity = async ({
  newAgent,
  context,
}: {
  newAgent: NewAgentArgs;
  context: GraphqlRequestContext;
}) => {
  if (!newAgent.identityBlockchain)
    throw Error("ERROR: upsertIdentityBlockchain - missing identityBlockchain");

  const isWallet = isAddress(newAgent.identityBlockchain.address);
  const ensRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const isEns = !!newAgent.identityBlockchain.address.match(ensRegex);
  if (!isWallet && !isEns) throw Error("Error: Invalid address / ens input");
  const ensAddress = isEns
    ? await viemClient.forChain(Blockchain.Ethereum).getEnsAddress({
        name: normalize(newAgent.identityBlockchain.address),
      })
    : null;

  const wallet = (ensAddress ?? newAgent.identityBlockchain.address).toLowerCase();

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
          ens: newAgent.identityBlockchain.address.toLowerCase(),
        }
      : {},
    create: {
      address: wallet,
      ens: isEns ? newAgent.identityBlockchain.address.toLowerCase() : null,
      Identity: {
        create: {
          Entity: { create: {} },
        },
      },
    },
  });

  return formatIdentity(res.Identity as IdentityPrismaType, context.currentUser);
};
