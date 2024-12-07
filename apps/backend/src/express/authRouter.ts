// import { urlStrToAuthDataMap } from "@telegram-auth/server";
import { Router } from "express";
import { GraphQLError } from "graphql";
import { OAuthProvider } from "stytch";

import { updateUserGroups } from "@/core/entity/updateEntitiesGroups/updateUserEntityGroups/updateUserGroups";
import { MePrismaType } from "@/core/user/userPrismaTypes";
import { CustomErrorCodes } from "@/graphql/errors";
import { upsertTelegramIdentity } from "@/telegram/upsertTelegramIdentity";
import { telegramValidator } from "@/telegram/validator";

import { createRequestContext } from "./createRequestContext";
import { prisma } from "../prisma/client";
import { createBlockchainIdentitiesForUser } from "../stytch/createBlockchainIdentities";
import { createDiscordIdentity } from "../stytch/createDiscordIdentity";
import { createEmailIdentities } from "../stytch/createEmailIdentities";
import { redirectAtLogin } from "../stytch/redirectAtLogin";
import { sessionDurationMinutes, stytchClient } from "../stytch/stytchClient";
import { upsertOauthToken } from "../stytch/upsertOauthToken";
import { upsertUser } from "../stytch/upsertUser";

const authRouter = Router();

// handles login / signup for all auth flows that user a access token (oauth / magiclink)
// creates session, user, and identities for user
authRouter.get("/token", async (req, res, next) => {
  try {
    const { stytch_token_type, token } = req.query;
    // for when this endpoint is called to attach identity to existing user
    // eslint-disable-next-line
    const exitingSessionToken: string | undefined = req.cookies["stytch_session"] as string;
    let sessionToken: string | undefined;
    let user: MePrismaType | undefined;

    await prisma.$transaction(async (transaction) => {
      if (typeof token !== "string" || !token || !stytch_token_type)
        throw Error("Missing authentication token");

      if (stytch_token_type === "oauth") {
        const stytchOAuthentication = await stytchClient.oauth.authenticate({
          token: token,
          session_duration_minutes: sessionDurationMinutes,
        });

        sessionToken = stytchOAuthentication.session_token;
        user = await upsertUser({ stytchUser: stytchOAuthentication.user, res, transaction });
        await upsertOauthToken({ stytchOAuthentication, user, transaction });

        // create Discord username identity (if it doesn't already exist) and tie it to that user
        if (stytchOAuthentication.provider_type === "Discord") {
          await createDiscordIdentity({
            userId: user.id,
            accessToken: stytchOAuthentication.provider_values.access_token,
            transaction,
          });
        } else if (stytchOAuthentication.provider_type === "Google") {
          const providerDetails: OAuthProvider | undefined =
            stytchOAuthentication.user.providers.find((provider) => {
              return (
                provider.oauth_user_registration_id ===
                stytchOAuthentication.oauth_user_registration_id
              );
            });
          await createEmailIdentities({
            user,
            stytchEmails: stytchOAuthentication.user.emails,
            profilePictureURL: providerDetails?.profile_picture_url,
            transaction,
          });
        }
      } else if (stytch_token_type === "magic_links" || stytch_token_type === "login") {
        const stytchMagicAuthentication = await stytchClient.magicLinks.authenticate({
          token,
          session_duration_minutes: sessionDurationMinutes,
          // if user is already logged in, use their session token
          session_token: exitingSessionToken,
        });
        sessionToken = stytchMagicAuthentication.session_token;
        user = await upsertUser({
          stytchUser: stytchMagicAuthentication.user,
          res,
          transaction,
        });
        await createEmailIdentities({
          user,
          stytchEmails: stytchMagicAuthentication.user.emails,
          transaction,
        });
      }
    });

    await updateUserGroups({ context: createRequestContext({ user }) });
    if (sessionToken) res.cookie("stytch_session", sessionToken);
    redirectAtLogin({ req, res });
  } catch (e) {
    next(e);
  }
});

// Attaches Discord login to an existing Stytch account
// sends user oauth token which they use to begin the oauth flow
// at which point user is directed through normal /token flow
authRouter.post("/attach-discord", async (req, res, next) => {
  try {
    //eslint-disable-next-line
    const session_token = req.cookies["stytch_session"] as string;
    if (!session_token) res.status(401).send();
    const resp = await stytchClient.oauth.attach({
      session_token,
      provider: "discord",
    });
    res.send(resp.oauth_attach_token);
  } catch (e) {
    next(e);
  }
});

// creates blockchain identities for user on authentication
// session already created for user on FE --> user also already created via authenticateSession
authRouter.post("/crypto", async (req, res, next) => {
  let user: MePrismaType | undefined;
  try {
    //eslint-disable-next-line
    const session_token = req.cookies["stytch_session"] as string;
    if (!session_token) res.status(401).send();

    const sessionData = await stytchClient.sessions.authenticate({
      session_token,
      session_duration_minutes: sessionDurationMinutes,
    });

    await prisma.$transaction(async (transaction) => {
      user = await upsertUser({ stytchUser: sessionData.user, res, transaction });
      // create blockchain identities if they don't already exist
      return await createBlockchainIdentitiesForUser({
        user,
        stytchWallets: sessionData.user.crypto_wallets,
        transaction,
      });
    });

    await updateUserGroups({ context: createRequestContext({ user }) });

    redirectAtLogin({ req, res });
    // res.status(200).send();
  } catch (e) {
    next(e);
  }
});

// creates email identities for user on authentication
// session already created for user on FE --> user also already created via authenticateSession
authRouter.post("/password", async (req, res, next) => {
  let user: MePrismaType | undefined;
  try {
    //eslint-disable-next-line
    const session_token = req.cookies["stytch_session"] as string;
    const sessionData = await stytchClient.sessions.authenticate({
      session_token,
      session_duration_minutes: sessionDurationMinutes,
    });
    // const sessionToken = sessionData.session_token;

    if (!session_token) {
      res.status(401).send();
    }

    await prisma.$transaction(async (transaction) => {
      user = await upsertUser({ stytchUser: sessionData.user, res, transaction });

      await createEmailIdentities({
        user,
        stytchEmails: sessionData.user.emails,
        transaction,
      });
    });
    await updateUserGroups({ context: createRequestContext({ user }) });
    redirectAtLogin({ req, res });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/telegram", async (req, res, next) => {
  try {
    //eslint-disable-next-line
    const data = new Map(Object.entries(req.body));
    // note telegramValidator is implicitly using botToken to validate
    // if FE Telegram bot token is different from BE bot token, this will fail
    // @ts-expect-error TODO
    const telegramUserData = await telegramValidator.validate(data);
    const user = res.locals.user as MePrismaType | undefined;

    if (!user)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    // The data is now valid and you can sign in the user.
    await upsertTelegramIdentity({
      telegramUserData,
      userId: user?.id,
    });
  } catch (e) {
    res.sendStatus(500);
    next(e);
  }
});

export default authRouter;
