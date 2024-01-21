import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import cors from "cors";
import { json } from "body-parser";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";

import { resolvers } from "./graphql/resolvers/query_resolvers";
import { authenticateSession } from "./auth/authenticateSession";
import { GraphqlRequestContext } from "./graphql/context";
import { DiscordApi } from "./discord/api";
import { prisma } from "./prisma/client";
import { stytchClient } from "./auth/stytchClient";
import { MePrismaType } from "./utils/formatUser";
import { createBlockchainIdentities } from "./auth/createBlockchainIdentities";
import { createEmailIdentities } from "./auth/createEmailIdentities";
import { upsertUser } from "./auth/upsertUser";
import { upsertOauthToken } from "./auth/upsertOauthToken";
import { createDiscordIdentity } from "./auth/createDiscordIdentity";
import { redirectAtLogin } from "./auth/redirectAtLogin";
import { OAuthProvider } from "stytch";

const host = process.env.HOST ?? "::1";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cookieParser());
app.use(authenticateSession);

const sessionValue = {
  secret: process.env.SESSION_SECRET as string,
  cookie: { secure: false },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionValue.cookie.secure = true; // serve secure cookies
}

// handles login / signup for all auth flows that user a access token (oauth / magiclink)
// creates session and also creates appropriate identities for user
app.get("/auth/token", async (req, res) => {
  const { stytch_token_type, token } = req.query;

  let sessionToken: string | undefined;
  await prisma.$transaction(async (transaction) => {
    if (typeof token !== "string" || !token || !stytch_token_type)
      throw Error("Missing authentication token");

    if (stytch_token_type === "oauth") {
      const stytchOAuthentication = await stytchClient.oauth.authenticate({
        token: token,
        session_duration_minutes: 60,
      });

      sessionToken = stytchOAuthentication.session_token;
      const user = await upsertUser({ stytchUser: stytchOAuthentication.user, transaction });
      await upsertOauthToken({ stytchOAuthentication, user });

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
        await createEmailIdentities(
          user,
          stytchOAuthentication.user.emails,
          providerDetails?.profile_picture_url,
        );
      }
    } else if (stytch_token_type === "magic_links" || stytch_token_type === "login") {
      const stytchMagicAuthentication = await stytchClient.magicLinks.authenticate({
        token,
        session_duration_minutes: 60,
      });
      sessionToken = stytchMagicAuthentication.session_token;
      const user = await upsertUser({ stytchUser: stytchMagicAuthentication.user, transaction });
      await createEmailIdentities(user, stytchMagicAuthentication.user.emails);
    }
  });

  if (sessionToken) res.cookie("stytch_session", sessionToken);

  redirectAtLogin({ req, res });
});

// Attaches Discord login to an existing Stytch account
app.post("/auth/attach-discord", async (req, res) => {
  const session_token = req.cookies["stytch_session"];
  if (!session_token) res.status(401).send();
  const resp = await stytchClient.oauth.attach({
    session_token,
    provider: "discord",
  });
  res.send(resp.oauth_attach_token);
});

// creates blockchain identities for user on authentication
// session already created for user on FE
app.post("/auth/crypto", async (req, res) => {
  const session_token = req.cookies["stytch_session"];
  const sessionData = await stytchClient.sessions.authenticate({ session_token });

  if (!session_token) res.status(401).send();

  // create blockchain identities if they don't already exist
  await createBlockchainIdentities(res.locals.user, sessionData.user.crypto_wallets);

  res.status(200).send();
});

// creates email identities for user on authentication
// session already created for user on FE
app.post("/auth/password", async (req, res) => {
  const session_token = req.cookies["stytch_session"];
  const sessionData = await stytchClient.sessions.authenticate({ session_token });
  const sessionToken = sessionData.session_token;

  if (!session_token) {
    res.status(401).send();
  }

  // create email identities if they don't already exist
  await createEmailIdentities(res.locals.user, sessionData.user.emails);
  res.cookie("stytch_session", sessionToken);

  // res.status(200).send();
  redirectAtLogin({ req, res });
});

app.use(session(sessionValue));

const typeDefs = mergeTypeDefs(
  loadFilesSync("./src/graphql", { recursive: true, extensions: [".graphql"] }),
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer<GraphqlRequestContext>({
  schema,
  formatError: (formattedError, error) => {
    console.log(error);

    return formattedError;
  },
});

server.start().then(() => {
  app.use(authenticateSession);
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_BASE_URL,
      credentials: true,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ res }) => {
        const user: MePrismaType | undefined = res.locals.user;

        return {
          currentUser: user,
          discordApi: user ? DiscordApi.forUser(res.locals.user) : undefined,
        };
      },
    }),
  );

  app.listen(port, host, () => {
    console.log(`[ API Ready ] http://${host}:${port}`);
  });
});
