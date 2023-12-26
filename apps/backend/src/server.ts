import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import { resolvers } from "./graphql/resolvers/query_resolvers";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import cookieParser from "cookie-parser";
import { authenticate } from "./authentication";
import { GraphqlRequestContext } from "./graphql/context";
import { DiscordApi } from "./discord/api";
import session from "express-session";
import { User, OauthTypes } from "@prisma/client";
import { prisma } from "./prisma/client";
import { stytchClient } from "./authentication";
import { APIUser } from "discord.js";
const host = process.env.HOST ?? "::1";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cookieParser());
app.use(authenticate);

const sessionValue = {
  secret: process.env.SESSION_SECRET as string,
  cookie: { secure: false },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionValue.cookie.secure = true; // serve secure cookies
}

app.get("/auth", async (req, res) => {
  const { stytch_token_type, token } = req.query;
  let sessionToken: string | undefined;

  if (typeof token === "string" && token && stytch_token_type) {
    if (stytch_token_type === "oauth") {
      const authentication = await stytchClient.oauth.authenticate({
        token: token,
        session_duration_minutes: 60,
      });
      sessionToken = authentication.session_token;

      // check if that user already exists, create if they don't
      const user = await prisma.user.upsert({
        where: {
          stytchId: authentication.user.user_id,
        },
        update: {
          Oauths: {
            upsert: {
              update: {
                type: authentication.provider_type as OauthTypes,
                accessToken: authentication.provider_values.access_token,
                refreshToken: authentication.provider_values.refresh_token,
                scopes: authentication.provider_values.scopes,
                expiresAt: authentication.provider_values.expires_at,
              },
              create: {
                type: authentication.provider_type as OauthTypes,
                accessToken: authentication.provider_values.access_token,
                refreshToken: authentication.provider_values.refresh_token,
                scopes: authentication.provider_values.scopes,
                expiresAt: authentication.provider_values.expires_at,
              },
            },
          },
        },
        create: {
          stytchId: authentication.user.user_id,
          firstName: authentication.user.name?.first_name,
          lastName: authentication.user.name?.last_name,
        },
      });

      // create Discord username identity (if it doesn't already exist) and tie it to that user
      if (authentication.provider_type === "Discord") {
        const discordUser = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${authentication.provider_values.access_token}`,
          },
        });

        const { id, username, avatar, discriminator } = (await discordUser.json()) as APIUser;

        const existingIdentity = await prisma.identityDiscord.findFirst({
          where: {
            discordUserId: id,
          },
        });

        if (existingIdentity) {
          await prisma.identity.update({
            where: {
              id: existingIdentity.identityId,
            },
            data: {
              userId: user.id,
              IdentityDiscord: {
                update: {
                  username,
                  avatar,
                  discriminator,
                },
              },
            },
          });
        } else {
          await prisma.identity.create({
            data: {
              userId: user.id,
              IdentityDiscord: {
                create: {
                  discordUserId: id,
                  username,
                  avatar,
                  discriminator,
                },
              },
            },
          });
        }
      }
    } else if (stytch_token_type === "magic_links" || stytch_token_type === "login") {
      const authentication = await stytchClient.magicLinks.authenticate({
        token,
        session_duration_minutes: 60,
      });
      sessionToken = authentication.session_token;
    }
  }

  if (sessionToken) res.cookie("stytch_session", sessionToken);

  res.redirect(process.env.CLIENT_REDIRECT_URL as string);
});

app.use(session(sessionValue));

// TODO: Create endpoint for saving session token
// const BCRYPT_SALT_ROUNDS = 12;
// Encrypt using AES - NOT hashing
// const encryptedAccessToken = await bcrypt.hash(
//   access_token,
//   BCRYPT_SALT_ROUNDS
// );
// const encryptedRefreshToken = await bcrypt.hash(
//   refresh_token,
//   BCRYPT_SALT_ROUNDS
// );

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
  app.use(authenticate);
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_REDIRECT_URL,
      credentials: true,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ res }) => {
        const user: User | undefined = res.locals.user;

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
