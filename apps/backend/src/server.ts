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
import { User } from "@prisma/client";

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
          clearCookie: (name: string) => res.clearCookie(name),
        };
      },
    }),
  );

  app.listen(port, host, () => {
    console.log(`[ API Ready ] http://${host}:${port}`);
  });
});
