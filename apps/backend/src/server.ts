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
import { OauthTypes } from "@prisma/client";
import { prisma } from "./prisma/client";
import { stytchClient } from "./authentication";
import { APIUser } from "discord.js";
import { encrypt } from "./encrypt";
import { MePrismaType } from "./utils/formatUser";

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
  const { stytch_token_type, token, next_route } = req.query;

  const redirectURL = new URL(next_route?.toString() as string, "http://localhost:5173");
  // removing potentially malicious url params
  redirectURL.search = "";

  let sessionToken: string | undefined;
  let user;

  if (typeof token === "string" && token && stytch_token_type) {
    if (stytch_token_type === "oauth") {
      const authentication = await stytchClient.oauth.authenticate({
        token: token,
        session_duration_minutes: 60,
      });
      sessionToken = authentication.session_token;

      // check if that user already exists, create if they don't
      user = await prisma.user.findFirst({
        where: {
          stytchId: authentication.user.user_id,
        },
      });

      const encryptedAccessToken = encrypt(authentication.provider_values.access_token);
      const encryptedRefreshToken = encrypt(authentication.provider_values.refresh_token);

      if (user) {
        await prisma.oauths.upsert({
          where: {
            userId: user.id,
            type: authentication.provider_type as OauthTypes,
          },
          update: {
            type: authentication.provider_type as OauthTypes,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            scopes: authentication.provider_values.scopes,
            expiresAt: authentication.provider_values.expires_at,
          },
          create: {
            userId: user.id,
            type: authentication.provider_type as OauthTypes,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            scopes: authentication.provider_values.scopes,
            expiresAt: authentication.provider_values.expires_at,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            stytchId: authentication.user.user_id,
            firstName: authentication.user.name?.first_name ?? null,
            lastName: authentication.user.name?.last_name ?? null,
            Oauths: {
              create: {
                type: authentication.provider_type as OauthTypes,
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                scopes: authentication.provider_values.scopes,
                expiresAt: authentication.provider_values.expires_at,
              },
            },
          },
        });
      }

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

  res.redirect(redirectURL.toString());
});

app.get("/auth/attach-discord", async (req, res) => {
  const session_token = req.cookies["stytch_session"];
  if (!session_token) res.status(401).send();

  const resp = await stytchClient.oauth.attach({
    session_token,
    provider: "discord",
  });

  // res.cookie("oauth_attach_token", resp.oauth_attach_token);

  res.send(resp.oauth_attach_token);
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
  app.use(authenticate);
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
