import { prisma } from "@/prisma/client";
import { UserPrismaType } from "@/core/user/formatUser";
import { CryptoWallet } from "stytch";

// creates blockchain identities in db if they don't exist yet
export const createBlockchainIdentitiesForUser = async (
  user: UserPrismaType,
  stytchWallets: CryptoWallet[],
) => {
  stytchWallets.forEach(async (wallet) => {
    const userWallet = user.Identities.find((identity) => {
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
      } else {
        // otherwise associate existing identity with this user
        await prisma.identity.update({
          where: {
            id: existingIdentity.identityId,
          },
          data: {
            userId: user.id,
          },
        });
      }
    }
  });
};
