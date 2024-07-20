import { NextFunction, Request, Response } from "express";
import { StytchError } from "stytch";

import { createBlockchainIdentitiesForUser } from "./createBlockchainIdentities";
import { createEmailIdentities } from "./createEmailIdentities";
import { sessionDurationMinutes, stytchClient } from "./stytchClient";
import { upsertUser } from "./upsertUser";

// authetnicate session token and get user data for graphql context
export const authenticateSession = async (req: Request, res: Response, next: NextFunction) => {
  const session_token = req.cookies["stytch_session"];
  if (!session_token) {
    res.locals.user = null;
    return next();
  }

  try {
    const session = await stytchClient.sessions.authenticate({
      session_token,
      session_duration_minutes: sessionDurationMinutes,
    });

    const user = await upsertUser({ stytchUser: session.user, res });

    // create identities if they don't already exist
    // TODO: create Discord identity if it doesn't exist
    if (session.user.emails.length !== user.Identities.filter((id) => id.IdentityEmail).length)
      await createEmailIdentities(user, session.user.emails);
    if (
      session.user.crypto_wallets.length !==
      user.Identities.filter((id) => id.IdentityBlockchain).length
    )
      await createBlockchainIdentitiesForUser(user, session.user.crypto_wallets);

    res.locals.user = user;
  } catch (error) {
    res.locals.user = null;
    if (error instanceof StytchError) {
      if (error.status_code !== 404)
        console.log("Authentication error validating stytch session: ", error);
    } else console.log("Authentication error: ", error, req.path, req.method);
  }

  await next();
};
