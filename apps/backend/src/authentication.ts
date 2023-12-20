import { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma/client";
import stytch, { Client as StytchClient, CryptoWallet, Email } from "stytch";
import { UserPrismaType, userInclude } from "./utils/formatUser";

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
      include: userInclude,
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
    let foundMatch = false;

    for (let i = 0; i <= user.Identities.length - 1; i++) {
      // only adding if email is verified (via oauth or magiclink)
      if (user.Identities[i].IdentityEmail?.email === email.email && email.verified) {
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
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
    }
  });
};

// creates blockchain identities in db if they don't exist yet
const createBlockchainIdentities = async (user: UserPrismaType, stytchWallets: CryptoWallet[]) => {
  stytchWallets.forEach(async (wallet) => {
    let foundMatch = false;

    for (let i = 0; i <= user.Identities.length - 1; i++) {
      if (user.Identities[i].IdentityBlockchain?.address === wallet.crypto_wallet_address) {
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
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
    }
  });
};
