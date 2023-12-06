import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "./prisma/client";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  try {
    const { sub } = (await verify(token, process.env.JWT_SECRET as string)) as {
      sub: string;
    };
    const user = await prisma.user.findFirst({
      where: {
        discordOauth: { discordId: sub },
      },
      include: { discordData: true, discordOauth: true },
    });
    res.locals.user = user;
  } catch (error) {
    // User is not logged in
    res.locals.user = null;
  }

  await next();
};
