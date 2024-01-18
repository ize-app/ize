import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/client";
import stytch, { Client as StytchClient, StytchError } from "stytch";
import { meInclude } from "../utils/formatUser";

export const stytchClient: StytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_PROJECT_SECRET as string,
});

// authetnicate session token and get user data for graphql context
export const authenticateSession = async (req: Request, res: Response, next: NextFunction) => {
  const session_token = req.cookies["stytch_session"];
  if (!session_token) {
    res.locals.user = null;
    return next();
  }

  try {
    const session = await stytchClient.sessions.authenticate({ session_token });

    // find or create user
    const user = await prisma.user.upsert({
      include: meInclude,
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
    if (error instanceof StytchError) {
      if (error.status_code !== 404)
        console.log("Authentication error validating stytch session: ", error);
    } else console.log("Authentication error: ", error, req.path, req.method);
  }

  await next();
};
