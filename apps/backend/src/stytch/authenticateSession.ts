import * as Sentry from "@sentry/node";
import { NextFunction, Request, Response } from "express";
import { StytchError } from "stytch";

import { meInclude } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";

import { sessionDurationMinutes, stytchClient } from "./stytchClient";

// authenticate session token and get user data for graphql context
export const authenticateSession = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line
  const session_token = req.cookies["stytch_session"] as string;
  if (!session_token) {
    res.locals.user = null;
    return next();
  }

  try {
    const session = await stytchClient.sessions.authenticate({
      session_token,
      session_duration_minutes: sessionDurationMinutes,
    });

    const user = await prisma.user.findFirst({
      include: meInclude,
      where: {
        stytchId: session.user.user_id,
      },
    });

    res.locals.user = user;

    if (user) {
      Sentry.setUser({
        id: user.id,
        username: user.name,
      });
    }
  } catch (error) {
    res.locals.user = null;
    if (error instanceof StytchError) {
      if (error.status_code !== 404) {
        Sentry.captureException(error, {
          tags: { location: "auth" },
          contexts: {
            auth: { type: "session-auth" },
          },
        });
      }
    } else {
      Sentry.captureException(error, {
        tags: { location: "auth" },
        contexts: {
          auth: { type: "session-auth" },
        },
      });
    }
  }

  next();
};
