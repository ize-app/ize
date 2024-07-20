import { CryptoWallet } from "stytch";

import { UserPrismaType } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";

// creates blockchain identities in db if they don't exist yet
export const createBlockchainIdentitiesForUser = async (
  user: UserPrismaType,
  stytchWallets: CryptoWallet[],
) => {
  stytchWallets.forEach(async (wallet) => {
    const userWallet = (user.Identities ?? []).find((identity) => {
      identity.IdentityBlockchain?.address === wallet.crypto_wallet_address;
    });

    if (!userWallet) {
      const existingIdentity = await prisma.identityBlockchain.findFirst({
        where: {
          address: wallet.crypto_wallet_address.toLowerCase(),
        },
      });
      if (!existingIdentity) {
        // if there isn't an existing identity for this address, create it
        try {
          await prisma.identity.create({
            data: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              Entity: {
                create: {},
              },
              IdentityBlockchain: {
                create: {
                  address: wallet.crypto_wallet_address.toLowerCase(),
                },
              },
            },
          });
        } catch (e) {
          console.error("Error creating blockchain identity", e);
        }
      } else {
        // otherwise associate existing identity with this user

        try {
          await prisma.identity.update({
            where: {
              id: existingIdentity.identityId,
            },
            data: {
              userId: user.id,
            },
          });
        } catch (e) {
          console.error("Error associating blockchain identity with user", e);
        }
      }
    }
  });
};
