import { Prisma } from "@prisma/client";
import { CryptoWallet } from "stytch";

import { MePrismaType } from "@/core/user/userPrismaTypes";

// creates blockchain identities in db if they don't exist yet
export const upsertUserBlockchainIdentities = async ({
  user,
  stytchWallets,
  transaction,
}: {
  user: MePrismaType;
  stytchWallets: CryptoWallet[];
  transaction: Prisma.TransactionClient;
}) => {
  return await Promise.all(
    stytchWallets.map(async (wallet) => {
      const isAlreadyAssociatedToUser = (user.Identities ?? []).some((identity) => {
        identity.IdentityBlockchain?.address === wallet.crypto_wallet_address.toLowerCase();
      });

      if (!isAlreadyAssociatedToUser) {
        await transaction.identityBlockchain.upsert({
          where: {
            address: wallet.crypto_wallet_address.toLowerCase(),
          },
          create: {
            address: wallet.crypto_wallet_address.toLowerCase(),
            Identity: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                Entity: {
                  create: {},
                },
              },
            },
          },
          update: {
            Identity: {
              update: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            },
          },
        });
      }
    }),
  );
};
