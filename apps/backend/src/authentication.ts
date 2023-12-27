import { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma/client";
import stytch, { Client as StytchClient, CryptoWallet, Email } from "stytch";
import { UserPrismaType, meInclude } from "./utils/formatUser";

export const stytchClient: StytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_PROJECT_SECRET as string,
});

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const session_token = req.cookies["stytch_session"];
  if (!session_token) {
    res.locals.user = null;
    return next();
  }

  try {
    const session = await stytchClient.sessions.authenticate({ session_token });

    // find or create user
    const user = await prisma.user.upsert({
      include: meInclude,
      where: {
        stytchId: session.user.user_id,
      },
      update: {},
      create: {
        stytchId: session.user.user_id,
        firstName: session.user.name?.first_name,
        lastName: session.user.name?.last_name,
      },
    });

    // creates identities in db if they're missing
    // TODO: this is janky to check this on every request. figure out a way to only do this on log-in / sign-up
    await createBlockchainIdentities(user, session.user.crypto_wallets);
    await createEmailIdentities(user, session.user.emails);

    res.locals.user = user;
  } catch (error) {
    res.locals.user = null;
    console.log("Authentication error: ", error);
  }

  await next();
};

// creates email identities in db if they don't exist yet
const createEmailIdentities = async (user: UserPrismaType, stytchEmails: Email[]) => {
  stytchEmails.forEach(async (email) => {
    const userEmail = user.Identities.find((identity) => {
      identity.IdentityEmail?.email === email.email && email.verified;
    });

    if (!userEmail) {
      const existingIdentity = await prisma.identityEmail.findFirst({
        where: {
          email: email.email,
        },
      });
      if (!existingIdentity) {
        // if there isn't an existing identity for this address, create it
        await prisma.identity.create({
          data: {
            userId: user.id,
            IdentityEmail: {
              create: {
                email: email.email,
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

// creates blockchain identities in db if they don't exist yet
const createBlockchainIdentities = async (user: UserPrismaType, stytchWallets: CryptoWallet[]) => {
  stytchWallets.forEach(async (wallet) => {
    const userWallet = user.Identities.find((identity) => {
      identity.IdentityBlockchain?.address === wallet.crypto_wallet_address;
    });

    if (!userWallet) {
      const existingIdentity = await prisma.identityBlockchain.findFirst({
        where: {
          address: wallet.crypto_wallet_address,
        },
      });
      if (!existingIdentity) {
        // if there isn't an existing identity for this address, create it
        await prisma.identity.create({
          data: {
            userId: user.id,
            IdentityBlockchain: {
              create: {
                address: wallet.crypto_wallet_address,
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
