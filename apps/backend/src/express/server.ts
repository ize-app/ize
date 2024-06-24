import path from "path";

import "../sentry/instrument";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import * as Sentry from "@sentry/node";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { MePrismaType } from "@/core/user/userPrismaTypes";

import authRouter from "./authRouter";
import { expressGloalErrorHandler } from "./error";
import { validOrigins } from "./origins";
import { DiscordApi } from "../discord/api";
import { GraphqlRequestContext } from "../graphql/context";
import { resolvers } from "../graphql/resolvers/queryResolvers";
import { authenticateSession } from "../stytch/authenticateSession";

const host = process.env.HOST ?? "::1";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const frontendPath = path.join(__dirname, "../../frontend");
const app = express();

app.use(cookieParser());
app.use(authenticateSession);
app.use("/api/auth", authRouter);
app.use(express.static(frontendPath));

// Healthcheck endpoint used by Render
app.get("/healthcheck", async (_req, res) => {
  res.status(200).send();
});

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

// Serve the index.html file for any unknown paths (for SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use(expressGloalErrorHandler);

server.start().then(() => {
  app.use(authenticateSession);
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: validOrigins,
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

  const expressServer = app.listen(port, host, () => {
    console.log(`[ API Ready ] http://${host}:${port}`);
  });

  process.on("SIGTERM", () => {
    expressServer.close(() => {
      console.log("Process terminated");
    });
  });
});
