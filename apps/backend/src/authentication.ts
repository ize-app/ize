import { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma/client";
import stytch, { Client as StytchClient } from "stytch";

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
    const user = await prisma.user.upsert({
      include: { discordData: true, discordOauth: true },
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
    res.locals.user = user;
  } catch (error) {
    res.locals.user = null;
    console.log("Authentication error: ", error);
  }

  await next();
};
